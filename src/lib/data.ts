export type Channel = "instagram" | "facebook" | "whatsapp" | "web";

export type AgentRole =
  | "router"
  | "sales"
  | "support"
  | "retention"
  | "operations"
  | "manager";

export interface AgentDef {
  id: AgentRole;
  name: string;
  title: string;
  focus: string;
  escalation: string;
  status: "online" | "busy" | "idle";
  tools: string[];
  kpis: { resolved: number; satisfaction: number; avgResponse: string; handoffs: number };
  color: string;
  initials: string;
}

export const agents: AgentDef[] = [
  {
    id: "router",
    name: "Router",
    title: "Intent Concierge",
    focus: "Classifies intent, language & sentiment, then routes every conversation.",
    escalation: "Negative sentiment or unknown intent.",
    status: "online",
    tools: ["intent_classifier", "sentiment_scorer", "language_detect"],
    kpis: { resolved: 4821, satisfaction: 4.7, avgResponse: "0.2s", handoffs: 214 },
    color: "bg-sky-500",
    initials: "RT",
  },
  {
    id: "sales",
    name: "Sales",
    title: "Product Discovery & Checkout",
    focus: "Recommends products, answers sizing, and drives the DM to checkout.",
    escalation: "Price negotiation or custom requests.",
    status: "busy",
    tools: ["search_products", "create_payment_link", "apply_discount"],
    kpis: { resolved: 1894, satisfaction: 4.8, avgResponse: "1.4s", handoffs: 96 },
    color: "bg-emerald-500",
    initials: "SA",
  },
  {
    id: "support",
    name: "Support",
    title: "Order Care",
    focus: "Tracks orders, answers FAQs and shares live shipping status.",
    escalation: "Policy exceptions or missing parcels.",
    status: "online",
    tools: ["get_order_status", "search_knowledge_base", "check_return_eligibility"],
    kpis: { resolved: 2231, satisfaction: 4.6, avgResponse: "1.1s", handoffs: 143 },
    color: "bg-indigo-500",
    initials: "SU",
  },
  {
    id: "retention",
    name: "Retention",
    title: "Engagement & Recovery",
    focus: "Recovers abandoned carts and re-engages with offers.",
    escalation: "Unsubscribe or opt-out requests.",
    status: "idle",
    tools: ["create_offer", "recover_cart", "send_restock_alert"],
    kpis: { resolved: 642, satisfaction: 4.5, avgResponse: "2.0s", handoffs: 38 },
    color: "bg-amber-500",
    initials: "RE",
  },
  {
    id: "operations",
    name: "Operations",
    title: "Systems & Sync",
    focus: "Keeps inventory, CRM and logistics in perfect sync.",
    escalation: "System or API failures.",
    status: "online",
    tools: ["sync_inventory", "update_crm_contact", "check_logistics"],
    kpis: { resolved: 960, satisfaction: 4.9, avgResponse: "0.9s", handoffs: 11 },
    color: "bg-rose-500",
    initials: "OP",
  },
  {
    id: "manager",
    name: "Manager",
    title: "Governance & Approvals",
    focus: "Approves exceptions and escalates to the human team.",
    escalation: "Direct demand for a human agent.",
    status: "online",
    tools: ["approve_refund", "approve_exception", "handoff_to_human"],
    kpis: { resolved: 214, satisfaction: 4.9, avgResponse: "3.4s", handoffs: 214 },
    color: "bg-violet-500",
    initials: "MG",
  },
];

export const agentById = (id: AgentRole) => agents.find((a) => a.id === id)!;

/* ------------------------------- Products ------------------------------- */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt: number | null;
  stock: number;
  variant: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "restocking";
  rating: number;
  sold: number;
  badge?: string;
  accent: string;
}

export const products: Product[] = [
  { id: "SKU-1042", name: "Chaya Cotton Kurti", category: "Women", price: 1290, compareAt: 1650, stock: 42, variant: "M · Dusty Rose", status: "in-stock", rating: 4.8, sold: 320, accent: "bg-rose-300", badge: "Bestseller" },
  { id: "SKU-1098", name: "Nandini Embroidered Kurti", category: "Women", price: 1590, compareAt: null, stock: 8, variant: "L · Sage", status: "low-stock", rating: 4.7, sold: 141, accent: "bg-emerald-300", badge: "New" },
  { id: "SKU-1155", name: "Milan Anarkali Gown", category: "Women", price: 2450, compareAt: 2900, stock: 0, variant: "M · Ivory", status: "out-of-stock", rating: 4.9, sold: 87, accent: "bg-stone-300" },
  { id: "SKU-1207", name: "Dhakai Jamdani Saree", category: "Saree", price: 3890, compareAt: 4500, stock: 14, variant: "Free · Cream", status: "in-stock", rating: 5.0, sold: 203, accent: "bg-amber-300", badge: "Premium" },
  { id: "SKU-1212", name: "Tangail Cotton Saree", category: "Saree", price: 2190, compareAt: null, stock: 3, variant: "Free · Mustard", status: "low-stock", rating: 4.6, sold: 119, accent: "bg-yellow-300" },
  { id: "SKU-1330", name: "Leather Block-Heel Sandal", category: "Footwear", price: 1980, compareAt: 2400, stock: 26, variant: "38 · Tan", status: "in-stock", rating: 4.5, sold: 174, accent: "bg-orange-300" },
  { id: "SKU-1388", name: "Handcrafted Terracotta Earrings", category: "Accessories", price: 490, compareAt: null, stock: 61, variant: "One size · Rust", status: "in-stock", rating: 4.7, sold: 402, accent: "bg-red-300", badge: "Bestseller" },
  { id: "SKU-1410", name: "Silk Dupatta (Kashmir)", category: "Accessories", price: 890, compareAt: 1200, stock: 0, variant: "Free · Emerald", status: "restocking", rating: 4.6, sold: 95, accent: "bg-teal-300" },
];

/* -------------------------------- Orders -------------------------------- */

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "return-requested"
  | "returned";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  product: string;
  qty: number;
  amount: number;
  channel: Channel;
  agent: AgentRole;
  status: OrderStatus;
  date: string;
  eta: string;
  tracking: string;
}

export const orders: Order[] = [
  { id: "ORD-9317", customer: "Rafiul Islam", phone: "01711-224500", product: "Chaya Cotton Kurti", qty: 2, amount: 2580, channel: "instagram", agent: "sales", status: "shipped", date: "Aug 09", eta: "Aug 14", tracking: "BD00182917" },
  { id: "ORD-9316", customer: "Tasnim Rahman", phone: "01818-993210", product: "Dhakai Jamdani Saree", qty: 1, amount: 3890, channel: "facebook", agent: "sales", status: "processing", date: "Aug 10", eta: "Aug 15", tracking: "BD00182909" },
  { id: "ORD-9315", customer: "Nusrat Jahan", phone: "01677-120984", product: "Tangail Cotton Saree", qty: 1, amount: 2190, channel: "whatsapp", agent: "support", status: "delivered", date: "Aug 05", eta: "Aug 11", tracking: "BD00182902" },
  { id: "ORD-9314", customer: "Shakil Ahmed", phone: "01922-845671", product: "Leather Block-Heel Sandal", qty: 1, amount: 1980, channel: "instagram", agent: "sales", status: "return-requested", date: "Aug 06", eta: "—", tracking: "BD00182894" },
  { id: "ORD-9313", customer: "Mehedi Hasan", phone: "01521-447803", product: "Terracotta Earrings", qty: 3, amount: 1470, channel: "facebook", agent: "retention", status: "shipped", date: "Aug 08", eta: "Aug 13", tracking: "BD00182881" },
  { id: "ORD-9312", customer: "Sadia Chowdhury", phone: "01733-880214", product: "Silk Dupatta (Kashmir)", qty: 1, amount: 890, channel: "whatsapp", agent: "sales", status: "confirmed", date: "Aug 11", eta: "Aug 16", tracking: "Pending" },
  { id: "ORD-9311", customer: "Farhan Kabir", phone: "01844-109876", product: "Nandini Embroidered Kurti", qty: 2, amount: 3180, channel: "instagram", agent: "sales", status: "shipped", date: "Aug 07", eta: "Aug 12", tracking: "BD00182870" },
  { id: "ORD-9310", customer: "Priya Dutta", phone: "01611-334455", product: "Milan Anarkali Gown", qty: 1, amount: 2450, channel: "facebook", agent: "support", status: "returned", date: "Jul 30", eta: "—", tracking: "BD00182863" },
];

export const orderStatusMeta: Record<OrderStatus, { label: string; tone: string }> = {
  confirmed: { label: "Confirmed", tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  processing: { label: "Processing", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  shipped: { label: "Shipped", tone: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300" },
  delivered: { label: "Delivered", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  "return-requested": { label: "Return Requested", tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  returned: { label: "Returned", tone: "bg-stone-500/15 text-stone-600 dark:text-stone-300" },
};

/* ----------------------------- Conversations ---------------------------- */

export interface Conversation {
  id: string;
  customer: string;
  handle: string;
  channel: Channel;
  agent: AgentRole;
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  language: string;
  lastMessage: string;
  preview: string;
  time: string;
  unread: number;
  ongoing: boolean;
}

export const conversations: Conversation[] = [
  { id: "CV-221", customer: "Tasnim Rahman", handle: "@tasnim.r", channel: "instagram", agent: "sales", intent: "product-inquiry", sentiment: "positive", language: "Banglish", lastMessage: "Amra ki Dhaka te delivery dei?", preview: "Yes! Free delivery across Dhaka. Your order will arrive in 2–3 days. 🚚", time: "Now", unread: 2, ongoing: true },
  { id: "CV-220", customer: "Rafiul Islam", handle: "01711…4500", channel: "whatsapp", agent: "support", intent: "order-tracking", sentiment: "neutral", language: "Bangla", lastMessage: "Apnar order ta shipped hoyeche, tracking number: BD00182917", preview: "Thanks! I’ve checked the tracking and the parcel is in transit to your address.", time: "4m", unread: 1, ongoing: true },
  { id: "CV-219", customer: "Nusrat Jahan", handle: "@nusrat.j", channel: "instagram", agent: "retention", intent: "abandoned-cart", sentiment: "positive", language: "English", lastMessage: "Your cart is still waiting — here's 10% off to complete it.", preview: "Your cart is still waiting — here's 10% off to complete it and lock your order.", time: "18m", unread: 0, ongoing: true },
  { id: "CV-218", customer: "Shakil Ahmed", handle: "01922…5671", channel: "whatsapp", agent: "manager", intent: "refund-request", sentiment: "negative", language: "Banglish", lastMessage: "Escalated to Manager — refund above policy ceiling needs approval.", preview: "Escalated to Manager — refund above policy ceiling needs approval before we can proceed.", time: "32m", unread: 3, ongoing: true },
  { id: "CV-217", customer: "Farhan Kabir", handle: "@farhan.k", channel: "facebook", agent: "sales", intent: "product-inquiry", sentiment: "positive", language: "English", lastMessage: "The Jamdani is back in stock. Shall I hold one for you?", preview: "The Jamdani is back in stock. Shall I hold one for you and send the checkout link?", time: "1h", unread: 0, ongoing: true },
  { id: "CV-216", customer: "Priya Dutta", handle: "01611…3455", channel: "whatsapp", agent: "support", intent: "return", sentiment: "negative", language: "Bangla", lastMessage: "Return approved. Our courier will collect it tomorrow.", preview: "Return approved. Our courier will collect it tomorrow and you’ll get the refund in 5–7 working days.", time: "2h", unread: 0, ongoing: false },
  { id: "CV-215", customer: "Sadia Chowdhury", handle: "@sadia.c", channel: "instagram", agent: "sales", intent: "sizing", sentiment: "positive", language: "Banglish", lastMessage: "Size M fits a 30–32\" waist — perfect for your profile. ✅", preview: "Size M fits a 30–32\" waist — perfect for your profile. ✅", time: "3h", unread: 1, ongoing: false },
];

/* ------------------------- Comment-to-DM (demo) ------------------------- */

export interface DemoComment {
  id: string;
  name: string;
  handle: string;
  text: string;
  time: string;
  triggered: boolean;
  intent?: string;
  initials: string;
  accent: string;
}

export const demoPost = {
  brand: "athelier",
  image: "floral-post",
  caption: "Summer edit is here ✨ The Chaya Cotton Kurti, now in three new colours.",
  likes: 1248,
  commentsCount: 86,
};

export const comments: DemoComment[] = [
  { id: "cm1", name: "Tasnim Rahman", handle: "@tasnim.r", text: "PRICE", time: "2m", triggered: true, intent: "price-inquiry", initials: "TR", accent: "bg-rose-400" },
  { id: "cm2", name: "Farhan Kabir", handle: "@farhan.k", text: "Kemon dam? 👀", time: "9m", triggered: true, intent: "price-inquiry", initials: "FK", accent: "bg-indigo-400" },
  { id: "cm3", name: "Priya Dutta", handle: "@priya.d", text: "Siz available M?", time: "14m", triggered: true, intent: "sizing", initials: "PD", accent: "bg-emerald-400" },
  { id: "cm4", name: "Mehedi Hasan", handle: "@mehedi.h", text: "Wow, so beautiful 😍", time: "22m", triggered: false, initials: "MH", accent: "bg-sky-400" },
  { id: "cm5", name: "Sadia Chowdhury", handle: "@sadia.c", text: "Delivery Dhaka? 🚚", time: "41m", triggered: true, intent: "delivery", initials: "SC", accent: "bg-amber-400" },
  { id: "cm6", name: "Rafiul Islam", handle: "@rafi.i", text: "PRICE", time: "1h", triggered: true, intent: "price-inquiry", initials: "RI", accent: "bg-violet-400" },
  { id: "cm7", name: "Nusrat Jahan", handle: "@nusrat.j", text: "Is this true cotton?", time: "2h", triggered: true, intent: "material", initials: "NJ", accent: "bg-rose-400" },
  { id: "cm8", name: "Shakil Ahmed", handle: "@shakil.a", text: "Nice shot 👌", time: "3h", triggered: false, initials: "SA", accent: "bg-stone-400" },
];

/* ---------------------------- Knowledge Base ---------------------------- */

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: "PDF" | "Web" | "Policy" | "FAQ";
  category: string;
  pages: number;
  chunks: number;
  status: "indexed" | "syncing" | "failed";
  updated: string;
  size: string;
}

export const knowledgeDocs: KnowledgeDoc[] = [
  { id: "KB-01", title: "Return & Refund Policy 2026", type: "Policy", category: "Policies", pages: 4, chunks: 18, status: "indexed", updated: "Aug 10", size: "210 KB" },
  { id: "KB-02", title: "Shipping & Delivery Guide", type: "Policy", category: "Policies", pages: 3, chunks: 12, status: "indexed", updated: "Aug 08", size: "164 KB" },
  { id: "KB-03", title: "Sizing Guide — Kurti & Saree", type: "FAQ", category: "Catalog", pages: 6, chunks: 24, status: "indexed", updated: "Aug 07", size: "1.2 MB" },
  { id: "KB-04", title: "Care Instructions — Handloom", type: "PDF", category: "Catalog", pages: 8, chunks: 20, status: "syncing", updated: "Now", size: "3.4 MB" },
  { id: "KB-05", title: "FAQ — Payments & Cash on Delivery", type: "FAQ", category: "Support", pages: 2, chunks: 9, status: "indexed", updated: "Aug 05", size: "96 KB" },
  { id: "KB-06", title: "Brand Voice & Reply Guidelines", type: "Web", category: "Policies", pages: 12, chunks: 41, status: "indexed", updated: "Aug 02", size: "740 KB" },
  { id: "KB-07", title: "Product Terms & Fabric Glossary", type: "PDF", category: "Catalog", pages: 22, chunks: 64, status: "failed", updated: "Jul 29", size: "5.1 MB" },
];

export const kbSearchResults = [
  { id: "c1", doc: "Return & Refund Policy 2026", snippet: "…refunds are issued within **5–7 working days** once the returned item passes quality check…", score: 0.94 },
  { id: "c2", doc: "Sizing Guide — Kurti & Saree", snippet: "Size M fits a **30–32\" waist**, chest **36–38\"**…", score: 0.87 },
  { id: "c3", doc: "FAQ — Payments & Cash on Delivery", snippet: "Cash on Delivery is available **nationwide** at a flat fee of **৳60**…", score: 0.72 },
];

/* ------------------------------- Guardrails ------------------------------ */

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  rule: string;
  enforcement: "hard" | "soft";
  enabled: boolean;
}

export const policyRules: PolicyRule[] = [
  { id: "P-01", name: "Discount ceiling", description: "Sales agent may apply up to 10% without approval.", rule: "apply_discount ≤ 10%", enforcement: "hard", enabled: true },
  { id: "P-02", name: "Refund approval", description: "Refunds above ৳3,000 require Manager approval.", rule: "issue_refund > ৳3,000 → approval", enforcement: "hard", enabled: true },
  { id: "P-03", name: "API isolation", description: "LLMs only propose structured tool calls — never direct DB writes.", rule: "no_sql_from_llm", enforcement: "hard", enabled: true },
  { id: "P-04", name: "PII masking", description: "Phone numbers & addresses masked in all logs.", rule: "mask phone/address", enforcement: "hard", enabled: true },
  { id: "P-05", name: "24h messaging window", description: "No automated sends outside the Meta window.", rule: "window_check", enforcement: "hard", enabled: true },
  { id: "P-06", name: "Latency fallback", description: "API > 3s → human inbox or static response.", rule: "timeout = 3s", enforcement: "soft", enabled: true },
  { id: "P-07", name: "Opt-out honor", description: "Retention stops messaging on opt-out, instantly.", rule: "opt_out = block", enforcement: "hard", enabled: true },
];

export interface ToolCallLog {
  id: number;
  time: string;
  tool: string;
  agent: AgentRole;
  result: "allowed" | "blocked" | "approved" | "fallback";
  detail: string;
}

export const toolLogSeed: ToolCallLog[] = [
  { id: 1, time: "10:41:22", tool: "get_order_status", agent: "support", result: "allowed", detail: "ORD-9316 → shipped · BD00182909" },
  { id: 2, time: "10:41:05", tool: "search_products", agent: "sales", result: "allowed", detail: "kurti · price < ৳1,600 → 3 hits" },
  { id: 3, time: "10:40:58", tool: "apply_discount", agent: "sales", result: "blocked", detail: "12% > ceiling 10% · routed to Manager" },
  { id: 4, time: "10:40:41", tool: "create_payment_link", agent: "sales", result: "allowed", detail: "Cart CV-221 → link generated" },
  { id: 5, time: "10:40:30", tool: "issue_refund", agent: "manager", result: "approved", detail: "ORD-9314 · ৳1,980 · Shakil Ahmed" },
  { id: 6, time: "10:40:12", tool: "sync_inventory", agent: "operations", result: "allowed", detail: "SKU-1410 → restocking · 40 units" },
  { id: 7, time: "10:39:58", tool: "get_order_status", agent: "support", result: "fallback", detail: "Logistics API > 3s · static reply sent" },
];

export const toolCatalog = [
  { name: "search_products", desc: "Search catalog by name, category, price & filters.", scope: "Sales, Retention" },
  { name: "get_order_status", desc: "Live order status by order ID or phone.", scope: "Support" },
  { name: "create_payment_link", desc: "Generates a secure checkout link for a draft order.", scope: "Sales" },
  { name: "apply_discount", desc: "Applies a discount — gated by ceiling policy.", scope: "Sales, Retention" },
  { name: "issue_refund", desc: "Initiates a refund — requires Manager approval.", scope: "Manager" },
  { name: "search_knowledge_base", desc: "Vector search over policies, FAQs & docs.", scope: "Support, Sales" },
  { name: "sync_inventory", desc: "Synchronises stock across Shopify & WooCommerce.", scope: "Operations" },
  { name: "recover_cart", desc: "Proactive recovery — respects opt-out & windows.", scope: "Retention" },
];

/* -------------------------------- Analytics ------------------------------ */

export const revenueSeries = [
  { day: "Aug 04", revenue: 18200, orders: 14 },
  { day: "Aug 05", revenue: 22400, orders: 18 },
  { day: "Aug 06", revenue: 16800, orders: 12 },
  { day: "Aug 07", revenue: 29100, orders: 22 },
  { day: "Aug 08", revenue: 25300, orders: 19 },
  { day: "Aug 09", revenue: 31800, orders: 26 },
  { day: "Aug 10", revenue: 36400, orders: 31 },
  { day: "Aug 11", revenue: 40200, orders: 33 },
];

export const funnel = [
  { stage: "Comments", value: 86, note: "on last post" },
  { stage: "DMs started", value: 41, note: "via private reply" },
  { stage: "Qualified", value: 26, note: "by Sales agent" },
  { stage: "Checkout links", value: 18, note: "generated" },
  { stage: "Orders", value: 11, note: "converted" },
];

export const sentimentDist = [
  { label: "Positive", value: 64 },
  { label: "Neutral", value: 27 },
  { label: "Negative", value: 9 },
];

export const channelDist = [
  { name: "Instagram", value: 46 },
  { name: "Facebook", value: 28 },
  { name: "WhatsApp", value: 19 },
  { name: "Web", value: 7 },
];

export const agentPerformance = [
  { agent: "Sales", resolved: 1894, satisfaction: 4.8, aht: "1.4s" },
  { agent: "Support", resolved: 2231, satisfaction: 4.6, aht: "1.1s" },
  { agent: "Retention", resolved: 642, satisfaction: 4.5, aht: "2.0s" },
  { agent: "Operations", resolved: 960, satisfaction: 4.9, aht: "0.9s" },
  { agent: "Manager", resolved: 214, satisfaction: 4.9, aht: "3.4s" },
];

export const kpis = {
  conversationsToday: 1284,
  dmConversion: 12.3,
  revenueAttributed: 40200,
  containment: 87.4,
  avgResponse: 1.1,
  satisfaction: 4.7,
};

/* ------------------------------ Integrations ----------------------------- */

export const integrations = [
  { name: "Instagram", detail: "Connected · @athelier", channel: "instagram" as Channel, status: "connected", desc: "Comments, DMs & private replies" },
  { name: "Facebook Messenger", detail: "Connected · Athel.ier", channel: "facebook" as Channel, status: "connected", desc: "Page conversations & comment triggers" },
  { name: "WhatsApp Business", detail: "Connected · +880 1XXX-XXXXXX", channel: "whatsapp" as Channel, status: "connected", desc: "Cloud API with approved templates" },
  { name: "Shopify", detail: "Connected · athelier.myshopify.com", channel: "web" as Channel, status: "connected", desc: "Products, orders & inventory sync" },
  { name: "WooCommerce", detail: "Available to connect", channel: "web" as Channel, status: "disconnected", desc: "REST v3 adapter ready" },
  { name: "CRM (HubSpot)", detail: "Connected · 2,841 contacts", channel: "web" as Channel, status: "connected", desc: "Contact enrichment & sync" },
  { name: "Logistics (Pathao)", detail: "Connected · 4 zones", channel: "web" as Channel, status: "connected", desc: "Live tracking & ETA" },
];
