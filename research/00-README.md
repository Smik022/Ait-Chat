# Research Findings — AI-Powered Social Commerce (F-Commerce) Workforce Platform

This folder contains research findings that ground the Business Requirement Document (BRD v1.0) in current platform capabilities, market data, and technical realities. Research was conducted in August 2026 against live vendor documentation, developer portals, and market analyses.

## Document Map

| File | BRD Section Addressed | Summary |
| --- | --- | --- |
| [01-meta-channels.md](./01-meta-channels.md) | 1.3, 3, 7 (Meta Policy Compliance) | Instagram/Messenger/WhatsApp APIs, comment-to-DM mechanics, 24h window rules, permissions, pricing |
| [02-multi-agent-orchestration.md](./02-multi-agent-orchestration.md) | 1.2, 3, 4, 6 (FR-07) | LangGraph vs CrewAI vs Microsoft Agent Framework (AutoGen), supervisor/router patterns, handoffs |
| [03-localized-nlp-banglish.md](./03-localized-nlp-banglish.md) | 1.3, 3, 6 (FR-09) | Code-switched Banglish NLP: datasets, models, benchmark results, engineering approaches |
| [04-ecommerce-integrations.md](./04-ecommerce-integrations.md) | 1.3, 6 (FR-04/05/06) | Shopify + WooCommerce Admin APIs, webhooks, inventory sync, order tracking patterns |
| [05-competitor-analysis.md](./05-competitor-analysis.md) | 2, 3 | ManyChat, Gorgias, Userbot, FastBots + comment-to-DM tool landscape, pricing, feature gaps |
| [06-knowledge-base-rag.md](./06-knowledge-base-rag.md) | 1.3, 6 (FR-03) | RAG grounding: vector DBs, chunking, hybrid retrieval, multi-tenancy, e-commerce specifics |
| [07-guardrails-tool-gateway.md](./07-guardrails-tool-gateway.md) | 3, 6 (FR-10), 7 | Guardrail-protected tool gateways, policy engines, tool-call validation, human approvals |
| [08-architecture-recommendations.md](./08-architecture-recommendations.md) | 5, 6, 7 | Consolidated architecture guidance, stack recommendations, phase-1 build plan, risk register |

## Key Takeaways (Executive Summary)

1. **Comment-to-DM is natively supported by Meta** but is strictly regulated: a private reply to a comment is a *single* message sent within 7 days of the comment, after which a normal 24-hour messaging window opens only if the customer responds. Any "autonomous abandoned-cart / restock outreach" must be designed inside these windows or via WhatsApp approved templates.
2. **All three channels are one platform**: Instagram DM, Messenger, and WhatsApp Business Cloud API all run on `graph.facebook.com` with webhook-driven delivery. A single "Channel Webhook Layer" + Handover Protocol architecture in the BRD is achievable today.
3. **Multi-agent orchestration frameworks have consolidated**: LangGraph (graph/state machine — best for auditable routing + human approval), CrewAI (role-based teams — fastest prototype), and the Microsoft Agent Framework (AutoGen successor). The BRD's Router Agent + specialized agents + Manager Agent maps to the proven *supervisor pattern*.
4. **Banglish remains a genuine research problem**: best published results are ~67% accuracy (fine-tuned Llama-3-8B on sentiment). Strategy should be: strong multilingual LLM baseline + fine-tuned classifier adapters for sentiment/intent + Banglish-aware retrieval — not a single monolithic Banglish model.
5. **E-commerce ground truth belongs in live APIs, not the vector store**: order status and inventory must be fetched via Shopify/WooCommerce APIs (webhook-driven sync), while product marketing copy and policy PDFs live in the RAG store. Hybrid retrieval (vector + BM25) outperforms pure semantic search.
6. **Tool gateway guardrails are an established category**: policy engines (deterministic allow/deny on tool calls), tool-call schema validation, PII redaction, and human-in-the-loop approval interrupts are all mainstream patterns. The BRD's "Guardrail-Protected Tool Gateway" is well-aligned.
7. **Pricing model risk**: per-contact pricing (ManyChat) spikes with viral content; flat per-DM or per-resolution pricing (Gorgias) is more predictable. WhatsApp bills per template message delivered (marketing templates cost the most).

## Verification Status of BRD Claims

| BRD Claim | Verdict | Evidence Location |
| --- | --- | --- |
| Comment-to-DM triggers ("PRICE" → DM) | **Supported**, with 7-day + single-message constraint | 01-meta-channels.md §3 |
| 24-hour messaging window rules | **Confirmed**, plus approved template escape hatch | 01-meta-channels.md §4 |
| Router → specialized agents → manager | **Supported**, = supervisor/handoff pattern | 02-multi-agent-orchestration.md §2 |
| Banglish contextual NLP | **Partially supported** — SOTA is ~67%; needs hybrid approach | 03-localized-nlp-banglish.md §4 |
| Native Shopify/WooCommerce integration | **Confirmed** | 04-ecommerce-integrations.md |
| Live order tracking by ID/phone | **Confirmed** via order APIs + webhooks | 04-ecommerce-integrations.md §4 |
| Human handoff with context + sentiment | **Supported** (Handover Protocol, Gorgias pattern) | 01-meta-channels.md §6, 05-competitor-analysis.md §2 |
| Guardrail-protected tool gateway | **Supported** — mature category | 07-guardrails-tool-gateway.md |
| API latency > 3s → fallback to human/static | **Reasonable design constraint** | 08-architecture-recommendations.md §4 |
