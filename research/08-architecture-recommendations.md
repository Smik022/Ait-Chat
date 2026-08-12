# Architecture Recommendations & Risk Register

**BRD relevance:** §5 (System Architecture and Context Flow), §6 (Functional Requirements Matrix), §7 (Guardrails)

This document consolidates the research into concrete architecture decisions, a recommended stack, a Phase-1 build plan mapped to BRD requirements, and a risk register. It validates the BRD's §5 six-step context flow and corrects/refines a few assumptions.

---

## 1. Validating the BRD §5 Context Flow

| BRD Step | Verdict | Research basis |
| --- | --- | --- |
| 1. Customer interacts via IG, Messenger, WhatsApp, Web | ✅ Correct | All channels are webhook-driven on Meta infra; Web Chat is additive |
| 2. Message hits Channel Webhook Layer → Router Agent | ✅ Correct | `messages` webhook → normalized event → router |
| 3. Router classifies intent → transfers context to specialized agent | ✅ Correct | Supervisor pattern (LangGraph) — see 02-multi-agent-orchestration |
| 4. Agent generates parameters → Safe Tool & API Gateway | ✅ Correct | Guardrail-protected tool gateway — see 07-guardrails |
| 5. API Gateway interacts with external systems | ✅ Correct | Shopify/WooCommerce/CRM/logistics adapters — see 04-ecommerce |
| 6. Escalation → Manager Agent → Human Inbox | ✅ Correct | Handover Protocol / custom inbox — see 01-meta-channels §6 |

**Correction to BRD:** Step 1 should also mention **comment-to-DM** as a pre-conversation acquisition path (BRD §1.3 has it, but §5 flow omits comments). The comments webhook is a distinct intake channel that seeds Step 2.

---

## 2. Recommended Technology Stack

| Layer | Recommendation | Alternatives | Rationale |
| --- | --- | --- | --- |
| Agent orchestration | **LangGraph** (Python or TS) | CrewAI (prototyping), Microsoft Agent Framework | Auditable graph, durable checkpoints, human-approval interrupts (see 02 §3) |
| Router + intent/sentiment classifiers | Fine-tuned small adapters (Banglish) + LLM fallback | Pure LLM routing | Latency + cost + ~67% SOTA Banglish requires specialized classifiers (see 03) |
| Channel adapters | Instagram Graph API (FB Login), Messenger, WhatsApp Cloud API — one webhook server | — | Single infra for all three (see 01) |
| Tool gateway | App-layer FastAPI service: JSON-Schema validation + policy engine (Cedar or policy-gate) + RBAC + PII redaction + audit | Bedrock AgentCore, NeMo Guardrails IORails | Deterministic, framework-agnostic (see 07) |
| Knowledge base | RAG: Qdrant (per-tenant collections) + hybrid retrieval (vector + BM25, RRF) + reranker + semantic cache | Pinecone, Milvus | Multi-tenant hard isolation + code-mixed retrieval (see 06) |
| E-commerce adapters | Shopify Admin GraphQL + WooCommerce REST v3, canonical model behind adapter interface | — | Both mature; webhook-driven sync (see 04) |
| Event backbone | Kafka / EventBridge / Pub-Sub + idempotent consumers | — | Webhook burst absorption, durable ingestion (see 04, 06) |
| Human inbox | Custom inbox app (single-app path) or separate app + Handover Protocol | — | Meta requires human escalation (see 01 §6) |
| Observability | LangSmith traces + OTel (per-agent cost/latency) + audit logs | Langfuse | Required for multi-agent debugging (see 02 §4) |

---

## 3. Phase-1 Build Plan (mapped to FR matrix)

### Sprint A — Channel + Comment-to-DM (FR-01, FR-02)
1. Meta app setup, permissions, webhook server, payload normalization, HMAC verification.
2. Comments webhook → keyword + intent trigger → single private reply (7-day rule) → conversation seeded.
3. DM message webhook → message store + session init.

### Sprint B — Knowledge + Order ground truth (FR-03, FR-05, FR-06)
4. Ingestion pipeline (PDF/web/policy/FAQ → chunk → embed → Qdrant), webhook-driven catalog sync from Shopify/WooCommerce.
5. Order self-service tool: `get_order_status(order_id | phone)` via live APIs + order↔customer mapping.
6. RAG query path: router (searchable?) → hybrid retrieval → rerank → grounded generation with citations.

### Sprint C — Multi-agent + guardrails (FR-07, FR-08, FR-10)
7. LangGraph supervisor: Router → Sales/Support/Retention/Operations workers, escalation rules (negative sentiment, unknown intent, direct demand).
8. Tool gateway: schema validation, RBAC by agent role, discount/refund approval interrupts, PII redaction, audit log.
9. Manager Agent → Human Inbox handoff with sentiment score + summary (Handover Protocol).

### Sprint D — Localized NLP + retention (FR-09, +§3 differentiators)
10. Banglish normalization + fine-tuned intent/sentiment adapters; language-aware generation.
11. Abandoned-cart / restock recovery inside policy windows (24h windows, WhatsApp templates, FEP 72h).
12. Product cards / payment-link flows in DMs (FR-04) + analytics (containment, DM→order conversion, CSAT).

---

## 4. Key Risks & Mitigations

| # | Risk | Likelihood | Mitigation |
| --- | --- | --- | --- |
| R1 | **Meta policy violations** (messaging window, template misuse, no human escalation) → app review failure / account restriction | High | Enforce window rules in gateway (see 01 §7 checklist); WhatsApp template category discipline; always-available human path; shadow-mode rollouts |
| R2 | **Banglish quality below expectations** (SOTA ~67% sentiment) | High | Hybrid strategy (classifier adapters + LLM + hybrid retrieval); never route money paths on low-confidence classifications; build own labeled corpus |
| R3 | **Per-contact/viral pricing blowup** if copying ManyChat model | Medium | Adopt flat volume / per-DM / per-resolution pricing (see 05 §2) |
| R4 | **Multi-agent token burn / runaway loops** | Medium | Round caps, per-agent tool scoping, budget enforcement in gateway (see 02 §4, 07 §2) |
| R5 | **Stale transactional data** from embedding orders/inventory | Medium | Live-API routing for transactional intents; webhook-driven index sync (see 04, 06) |
| R6 | **Prompt injection via public DMs/comments** | Medium | Input guardrails (prompt-attack detection), topic enforcement, tool allowlist fail-closed (see 07 §4) |
| R7 | **PII leakage in logs / training data** | Medium | PII redaction at gateway, sanitize before ingestion, minimal-scope API permissions (see 07, 04) |
| R8 | **Latency > 3s on slow LLM/API paths** | Medium | Fast-path classifiers, semantic cache, per-node timeouts, fallback ladder (clarify → human/static) (see 02 §3, 06 §4) |
| R9 | **App Review delays** for Instagram messaging permissions | Medium | Start review early with complete UX (opt-in, human handoff, data deletion); use partner-certified pattern |
| R10 | **Merchant/tenant data isolation breach** | Low | Separate Qdrant collections per tenant + RBAC scoping + per-tenant credentials (see 06 §5, 07 §3) |

---

## 5. Open Decisions Requiring Product Owner Input

1. **Pricing model**: flat per-DM vs per-resolution vs per-contact (recommend flat volume + per-resolution AI).
2. **Human-inbox**: single-app custom inbox (faster MVP) vs separate Handover-Protocol app (better scalability) — recommend single-app for MVP.
3. **WhatsApp vs IG-first launch**: IG + Messenger is the lowest-friction entry (no template approval burden); WhatsApp adds template management + per-message cost. Recommend launching IG/Messenger first.
4. **Managed vs self-hosted vector DB**: Qdrant self-hosted (control, hard tenancy) vs Pinecone managed (ops). Recommend Qdrant self-hosted for MVP given multi-tenant isolation needs.
5. **Banglish adapter investment**: start with multilingual LLM + lightweight intent/sentiment models; invest in fine-tuning only after real DM/comment data accumulates.

---

## 6. Source Index (cross-reference)

- Channels: `01-meta-channels.md`
- Orchestration: `02-multi-agent-orchestration.md`
- Banglish NLP: `03-localized-nlp-banglish.md`
- E-commerce: `04-ecommerce-integrations.md`
- Competitors: `05-competitor-analysis.md`
- RAG/KB: `06-knowledge-base-rag.md`
- Guardrails: `07-guardrails-tool-gateway.md`
