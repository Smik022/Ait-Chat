# Guardrail-Protected Tool Gateway Research

**BRD relevance:** §3 (Guardrail-Protected Tool Gateway differentiator), §6 FR-10 (approval rules for discounts/refunds/exceptions), §7 (API Isolation, Data Privacy, System Reliability)

**Key finding up front:** The "LLM generates parameters only; validated gateway executes" architecture is a **mature, mainstream category** in 2026 — implemented by Amazon Bedrock AgentCore (Policy + interceptors), NVIDIA NeMo Guardrails (IORails), OpenAI Agents SDK (tool guardrails + human approvals), Databricks Unity AI Gateway, and open-source policy gates. The BRD's design is well-aligned and feasible with off-the-shelf patterns.

---

## 1. The Core Pattern (matches BRD §3 and §7 exactly)

```
LLM produces a structured tool-call (name + JSON arguments)  ← functional parameters only
   │
   ▼
GUARDRAIL / TOOL GATEWAY (application layer, deterministic)
   1. Allowlist check      — tool name in permitted set?
   2. Schema validation    — arguments match tool's JSON Schema?
   3. Authorization        — RBAC: which agent/tenant/principal may call this?
   4. Policy evaluation    — business rules (e.g., discount ≤ 5%, refund requires approval)
   5. Rate limit / budget  — per-session caps
   6. PII inspection       — redact/mask sensitive fields in + out
   7. (optional) HUMAN APPROVAL interrupt — pause for manager/human
   │
   ▼
Tool executes against external system (Shopify, WooCommerce, CRM, logistics)
   │
   ▼
RESULT returned through same gateway (validated, redacted, audited)
```

The LLM never has a database connection, never writes SQL, never mutates state directly. It only proposes calls. This is the BRD's "API Isolation" guardrail.

---

## 2. Available Building Blocks (2026)

| Capability | Products/Patterns | Notes |
| --- | --- | --- |
| **Deterministic tool-call policy** | Amazon Bedrock AgentCore Policy (Cedar allow/deny language); Databricks Unity AI Gateway service policies; open-source `policy-gate` (allowlist-first, fail-closed) | Cedar evaluates principal/action/resource + conditions in <1ms; every decision audited |
| **Dynamic validation / interception** | Bedrock AgentCore Lambda interceptors (REQUEST before, RESPONSE after); LLM Shield MCP Guard/Action Guard/RBAC Guard | Interceptors: token exchange, payload enrichment, response filtering, tool-list scoping |
| **Tool-call schema validation** | NVIDIA NeMo Guardrails IORails `tool call validation` / `tool result validation` | Checks allowed tool name + JSON-Schema-valid arguments; local (no extra LLM call); fail-closed |
| **Human-in-the-loop approval** | OpenAI Agents SDK guardrails + approvals; LangGraph `interrupt_before`/`interrupt_after` | Run pauses, state serialized, approve/reject, resume same run |
| **PII masking** | Bedrock Guardrails sensitive-info filters (31 PII entity types, confidence scores); LLM Shield clearance levels | Mask phone/address/email in logs = BRD §7 Data Privacy |
| **Per-session action limits** | LLM Shield Action Guard; Ferrata ToolGateway | Prevents runaway agents (e.g., >N destructive ops per session) |
| **Budget enforcement** | Ferrata UsageTracker; Unity AI Gateway spend caps | Token/API cost ceilings |
| **Audit trail** | Tamper-evident WAL audit log (Ferrata); CloudWatch per-decision logs (Bedrock) | Compliance-grade logging |

---

## 3. Design Guidance for THIS Product's Tool Gateway

### Tool catalog (what the agents may call) — each with JSON Schema
- `check_inventory(sku, region)` — read-only
- `get_order_status(order_id | phone)` — read-only
- `create_payment_link(order_draft)` — writes a draft order + returns checkout URL
- `apply_discount(order_id, percent, reason)` — **gated**: percent ≤ X%, requires Manager approval above threshold
- `issue_refund(order_id, amount, reason)` — **gated**: requires Manager/human approval (FR-10)
- `update_crm_contact(...)`, `sync_inventory(...)` — Operations only
- `search_knowledge_base(query)`, `search_products(filters)` — read-only, open

### Policy rules (FR-10, hard-coded)
- Discount ceiling per customer segment; refund ceiling per order; both require manager approval above hard limits.
- Policy exceptions (shipping-waiver, goodwill credit) always route to Manager Agent → Human Inbox.
- Sentiment-gated: aggressive escalation to human on negative sentiment (BRD §4 trigger).

### RBAC model
- **Agent roles** map to tool scopes (Sales agent ≠ refund agent). Align with BRD §4 agent definitions:
  - Sales: search_products, create_payment_link, apply_discount (≤ceiling)
  - Support: get_order_status, search_knowledge_base, eligibility checks
  - Retention: offer engine, discount (≤ceiling)
  - Operations: inventory sync, CRM update
  - Manager: approvals, exception policy, refunds
- **Tenant/merchant isolation**: per-merchant tool/credential scoping (Ferrata TenantIsolation; Databricks Unity Catalog ABAC).

### Fail-closed posture (BRD §7 System Reliability)
- Unknown/ambiguous/out-of-policy tool calls → **block**, don't pass through (NVIDIA IORails, policy-gate both fail closed).
- Latency > 3s on external API → fall back to Human Inbox or static response (BRD §7); encode as gateway timeout + workflow edge.

---

## 4. Prompt-Injection & Adversarial Notes (needed for a public-facing chatbot)

- Social DMs are attacker-controlled input. Add **prompt-attack detection** (jailbreak/prompt-injection/prompt-leakage) as input guardrail — Bedrock InvokeGuardrailChecks has it standalone with severity scores; LLM Shield has adversarial detection.
- **Topic enforcement** — customer-facing bot must stay on-brand/on-scope ("should only discuss your product").
- Output guardrails: prevent leakage of PII, internal pricing logic, or refusal-reversal.

---

## 5. Implementation Recommendations (stack fit)

- **Fastest path**: LangGraph `interrupt`/`interrupt_before` for approval gates + an application-layer tool gateway service (FastAPI) that: (a) validates the JSON-Schema tool call, (b) applies a deterministic policy file (e.g., Cedar or policy-gate TOML), (c) enforces RBAC by agent role + tenant, (d) redacts PII, (e) writes an audit record, (f) executes the adapter, (g) re-validates the result.
- Use **MCP** to expose adapters (Shopify, WooCommerce, KB, CRM) to the gateway so the tool surface is uniform and swappable.
- Start in **shadow mode** (evaluate without blocking) during rollout to calibrate thresholds (policy-gate, Unity Gateway both support this).

---

## 6. Sources
- AWS ML Blog — "Secure AI agents with Policy and Lambda interceptors in Amazon Bedrock AgentCore Gateway" (2026-06)
- AWS ML Blog — "Safeguard your agentic AI applications with the InvokeGuardrailChecks API" (2026-06)
- NVIDIA NeMo Guardrails Docs — Tool Calling (IORails engine)
- OpenAI API Docs — Guardrails and human review (approvals)
- Databricks Docs — "AI governance guide" (Unity AI Gateway)
- GitHub tobs-code/policy-gate — deterministic allowlist-first policy firewall
- GitHub rajumb502/ferrata — production-grade LLM tool-call governance
- LLM Shield docs (votal.ai) — MCP Guard, Action Guard, RBAC Guard, clearance levels
