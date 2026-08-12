# E-Commerce Integration Research — Shopify & WooCommerce

**BRD relevance:** §1.3 (E-Commerce Actions), §3 (live inventory, order tracking, payment links), §6 FR-04/05/06, §5 (API Gateway)

**Key finding up front:** Both Shopify and WooCommerce expose mature Admin APIs + webhooks. Critical architecture principle: **live transactional data (inventory, orders) belongs in real-time API calls, NOT in the vector store**. Embedding order/inventory state causes staleness and hallucinated statuses.

---

## 1. Platform Capability Summary

| | Shopify | WooCommerce |
| --- | --- | --- |
| Primary API | Admin API (GraphQL strategic; REST legacy) | REST API v3 (`/wp-json/wc/v3/`) |
| Auth | OAuth 2.0 or admin-issued tokens; `X-Shopify-Access-Token` header | Consumer key + secret (Basic auth) |
| Orders | `orders/create`, `orders/updated`, `orders/paid`, `refunds/create` webhooks | `/orders` CRUD + webhooks |
| Products | Products/variants/inventory APIs + `products/update` webhooks | `/products` CRUD |
| Inventory | GraphQL `inventorySetQuantities`; REST `inventory_levels/set`; `inventory_levels/update` webhook | `stock_quantity`, `manage_stock` fields on product update |
| Rate limits | REST: 40 req/min/store (leaky bucket, 2/s); GraphQL: 1,000 cost points/s (bucket 2,000) | Pagination default 10; WP REST pagination headers |
| Delivery guarantee | Webhooks: at-least-once, exponential backoff retries up to 48h | Standard webhook delivery |
| Versioning | Quarterly releases (e.g., 2026-01, 2026-04); pin version; supported ~12 months | v3 current, v2/v1 legacy |
| Idempotency | Required for some mutations (e.g., `refundCreate`) from API 2026-04 | Idempotency via consumer implementation |

---

## 2. Shopify Details

### Auth & versioning
- Public/custom apps use OAuth; custom apps made in admin use admin-app access tokens.
- Always pin version: `https://{store}.myshopify.com/admin/api/2026-07/products.json`.
- REST Admin API is **legacy** as of Oct 2024; new public apps must use GraphQL (Apr 2025). For our platform: prefer GraphQL for new features, keep REST for simple single-resource reads.

### Scopes (principle of least privilege)
- `read_products`/`write_products`, `read_orders`/`write_orders`, `read_customers`, `read_inventory`/`write_inventory`, `read_fulfillments`/`write_fulfillments`.

### Webhooks that matter
- `orders/create`, `orders/paid`, `orders/updated`, `refunds/create` → order tracking + returns
- `products/update`, `products/delete` → catalog sync
- `inventory_levels/update` → real-time stock
- `variants/in_stock`, `variants/out_of_stock` → restock triggers (the BRD's restock-recovery feature)
- `customers/data_request`, `customers/redact`, `shop/redact` → GDPR compliance (mandatory for apps)
- `app/uninstalled` → cleanup credentials

### Recommended sync pattern (event-driven)
```
Shopify webhook → event broker (EventBridge / Pub-Sub) → queue → consumer
  → update platform DB / vector index / CRM
  → idempotent handler keyed on X-Shopify-Webhook-Id (dedupe)
```
- **Bulk Operations API** (`bulkOperationRunQuery`, GraphQL) for initial backfill / large exports instead of paginated REST loops.
- Webhook retries up to 48h with exponential backoff; if all retries fail the subscription is removed → monitor and re-register.

---

## 3. WooCommerce Details

- Endpoints: `GET/POST/PUT/DELETE /wp-json/wc/v3/{resource}` for orders, products, customers, etc.
- Requires WP 4.4+, WooCommerce 3.5+ (v3 API), pretty permalinks.
- Official client: `@woocommerce/woocommerce-rest-api` (JS).
- Pagination via Link header; `per_page`, `offset` params.
- No built-in GraphQL (use WPGraphQL plugin if needed).
- Inventory management: set `manage_stock: true` and `stock_quantity` on product updates.
- Note: WooCommerce webhooks are less robust than Shopify's — build your own retry/idempotency layer.

---

## 4. Order Tracking (FR-06) — "Live order status via order ID or phone"

Design pattern:
1. Customer sends order ID or phone number (may be a *WhatsApp/IG phone* — mapping required).
2. **Look up by ID**: Shopify `order` query / WooCommerce `/orders?search=`. **Look up by phone**: search order by customer phone (Shopify `customers` → orders; WooCommerce `/customers` by phone then their orders). Store a local order↔customer mapping table to avoid re-querying.
3. Return fulfillment status, tracking numbers, carrier, delivery estimate from the live API.
4. **Do not** serve this from a cached index — order state changes minute-to-minute.

Real-world benefit (cited): AI assistants with real-time order data reduce "where is my order" tickets by **35–45%** (McKinsey, cited by Branch8).

---

## 5. Payment Links / Checkout (for "DM-to-Checkout")

- **Shopify**: Storefront API supports cart/checkout creation with a public access token (safe client-side). Create a draft order + checkout link, or use payment links from gateway apps. Product cards in DMs link to storefront checkout.
- **WooCommerce**: create order via REST (or cart via Storefront-like flow), return a checkout/payment URL.
- Interactive product cards (BRD FR-04, "Top-Notch") are a *messaging* concern (Meta generic templates/carousels) with URLs to these checkout flows.
- Gatekeeper: payment links must be generated through the **API Gateway / tool layer** — never let the LLM construct URLs or set amounts directly (see 07-guardrails).

---

## 6. Multi-Store / Multi-Tenant Considerations

- Each merchant = separate OAuth credentials, separate webhook registrations, separate rate-limit budget.
- Normalize all platforms into a **canonical model** (Order, Product/ProductVariant, Inventory, Customer, Fulfillment) behind a platform adapter interface — one RAG pipeline and one order-tracking service for all stores (Branch8 + Shopify guidance).
- Systems-of-record guidance: WMS/3PL owns physical inventory; Shopify owns checkout; ERP owns finance. Our platform is a consumer of events, not the source of truth.

---

## 7. Latency & Reliability Notes (for BRD 3s guardrail)

- Keep synchronous API calls (order lookup) on fast paths with timeouts; pre-warm cache of hot catalog data for product-discovery RAG.
- Route through the same event broker pattern to absorb Black-Friday-style webhook bursts.
- Idempotency for all state-changing calls (refunds, discount application, inventory adjustments) — Shopify now enforces idempotency keys on certain mutations.

---

## 8. Sources
- Shopify Enterprise Blog — "A Practical 7-Step Guide to Ecommerce Data Integration (2026)", "API Integration Strategy for Shopify"
- Shopify Dev Docs — Admin REST/GraphQL API reference (2026-07), Webhook resource, Inventory
- ECOSIRE — "Shopify API Integration: 2026 Guide", Inventory Sync docs
- WooCommerce Developer Docs — REST API v3
- Branch8 — "RAG System Implementation for E-Commerce AI Workflows"
