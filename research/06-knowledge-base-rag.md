# Knowledge Base & RAG Research

**BRD relevance:** §1.3 (Knowledge Base Sync), §6 FR-03 (vector search over PDFs/web/policies/FAQs), §5 (architecture)

**Key finding up front:** Production RAG for e-commerce support is a solved discipline with clear best practices: chunk per product variant (not fixed token size), hybrid search (vector + BM25 via RRF), webhook-driven incremental ingestion, low-temperature grounded generation, and live-API routing for transactional data. Multi-tenancy must be hard (separate collections per tenant), not metadata-filter-only.

---

## 1. Core Architecture (Indexing → Retrieval → Generation)

```
OFFLINE (ingestion):
  sources: PDFs / web pages / policies / FAQs / product catalog
    → parse (Unstructured.io, MinerU, etc.)
    → chunk (recursive, metadata-enriched)
    → embed (multilingual embeddings)
    → store in vector DB (Qdrant/Pinecone/Milvus/Chroma) + optional KG (Neo4j)

ONLINE (query):
  user message → (if transactional intent → LIVE API, not vector store)
  query rewrite (language normalization, Banglish→Bengali transliteration)
  hybrid retrieval: vector similarity + BM25 keyword (RRF fusion, k=60)
  rerank (cross-encoder, e.g., FlashRank / gte-rerank)
  grounded generation: LLM + retrieved context + citations, temperature ~0.1
  fallback: low confidence / no answer → clarify or handoff
```

---

## 2. Ingestion & Chunking — the decisions that matter

- **Chunk per product variant**, not per fixed token block. Product data (name, specs, variants, pricing, availability) must stay together or retrieval returns incomplete context.
- **Recursive chunking** (structural cues, flexible sizes) outperforms fixed-size chunking; gains further from **metadata enrichment** (titles/keywords appended to chunks) — eBay production study (ACL Industry 2026).
- **Webhook-driven incremental updates**, not nightly batch: keep the index within ~30s of catalog truth during flash sales (Branch8: Lambda triggered by Shopify `products/update` webhooks).
- Sanitize **PII before ingestion**; store `customer_id`/`tenant_id` metadata for tenant-aware retrieval.
- PDF-specific: many off-the-shelf projects hit per-file limits (e.g., 20MB Claude Projects); managed retrieval (Gemini File Search) is a valid "don't build a vector DB" shortcut for internal tools, but for a multi-tenant SaaS product self-managed vector DBs give the hard isolation and per-merchant knowledge control you need.

---

## 3. Retrieval — hybrid beats pure semantic on code-mixed + commerce data

| Technique | Role | Evidence |
| --- | --- | --- |
| Dense (vector similarity) | Semantic matching, paraphrases | FIRE 2025: dense alone misses lexical precision |
| Sparse (BM25) | Exact match — SKUs, order numbers, transliteration variants | critical for "NKE-AM90-BLK-42" style lookups |
| **RRF fusion** (k≈60) | Combine ranked lists | FIRE 2025: +38% MAP@10 over BM25 alone on Banglish |
| **Cross-encoder rerank** | Top-10 → top-3 precision | standard production pattern; FlashRank/Cohere/gte-rerank |
| Dynamic `alpha` (semantic:keyword) | Route by query type | 0.7 semantic for product Q&A; 0.3 keyword for order/SKU (Branch8) |
| **HyDE** (hypothetical doc) | Multi-turn retrieval quality | query rewrite + simulated response improves Hit@K (eBay) |
| Semantic cache (cosine ≈0.92) | Latency/cost | ~50ms cache hit vs ~2s full pipeline (multi-tenant e-commerce RAG reference) |

**Multilingual embeddings matter** — code-switching breaks naive models. Evidence: Cohere embed-multilingual-v3.0 improved retrieval accuracy k=5 from 72%→89% on HK (Cantonese/English) code-switching vs OpenAI embeddings (Branch8). Same applies to Banglish.

---

## 4. Generation — grounding and evaluation

- **Ground everything**: inject `Source:` metadata per chunk; instruct LLM to cite; low temperature (0.1) for factual accuracy; refuse/fallback when context insufficient.
- **Route transactional questions to live APIs** (order status, inventory) — never embed "order status at 2:05 PM" into a vector store. This hybrid (RAG for catalog/policy + tool-use for live data) keeps accuracy >95% (Branch8).
- **KG-augmented RAG** (GraphRAG over product/support-ticket graphs) showed +23% factual accuracy and 89% user satisfaction in e-commerce QA (arXiv 2509.14267) — a phase-2+ enhancement, not MVP.
- **Evaluate with RAGAS + LLM-judge on 100+ real queries weekly** (Branch8); eBay uses GPT-4o as Dialogue Manager for query rewrite + LLM relevance judge (Hit@K, mAP) to iterate rapidly.
- **Fallback ladder**: answer with citation → clarify (ambiguous) → handoff to human (no-answer) (eBay Responder pattern).

---

## 5. Vector DB Options

| Option | Best for | Notes |
| --- | --- | --- |
| **Qdrant** | Self-hosted, hybrid mode, multi-tenant | Built-in sparse-dense hybrid; per-tenant collections; used in production e-commerce RAG reference stack |
| **Pinecone Serverless** | Managed, no-ops | Sparse-dense index; data residency regions (ap-southeast-1, ap-southeast-2) |
| **Milvus** | Large-scale hybrid | Dense+sparse (BM25/TF-IDF); used with cheap cloud (Zilliz free) |
| **ChromaDB** | Local/prototyping | Hybrid search; SimpleMemory-ish; fine for dev |
| **Neo4j** (KG) | Relationship reasoning | Optional GraphRAG layer |

Multi-tenant e-commerce reference stack (production-grade, published): **LangGraph 5-node pipeline (Router→Retriever→Reranker→Generator→Citation) + Qdrant (separate collections per tenant) + Kafka (async ingestion/feedback) + Redis (semantic cache + memory) + PostgreSQL (prompts/audit) + RAGAS (eval)**. This is essentially the architecture this product should adopt for its knowledge layer.

---

## 6. Sources
- arXiv 2509.14267 — "Graph-Enhanced Retrieval-Augmented Question Answering for E-Commerce Customer Support"
- ACL Industry 2026 — "Optimizing RAG for E-Commerce How-To Assistance" (eBay)
- Branch8 — "RAG System Implementation for E-Commerce AI Workflows" (2026-04)
- GitHub dhaneshvashisth/multi-tenant-ecommerce-RAG (LangGraph/Qdrant/Kafka/Redis/Postgres)
- GitHub q1ngn1ng-web/shopkeeper-rag (LangGraph, Milvus, RRF+rerank pipeline)
- InterWorks — "Building an AI-Powered Support Tool from a PDF Knowledge Base" (2026-06)
- Actian — "Build a Private Multi-Tenant RAG System" (2026-05)
- FIRE 2025 — RRF hybrid retrieval on Banglish (CEUR Vol-4173)
