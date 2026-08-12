# Localized NLP Research — Banglish (Bangla–English Code-Mixing)

**BRD relevance:** §1.3 (Localized NLP), §3 (Bilingual & Hyper-Local NLP differentiator), §6 FR-09 (multi-language, Banglish context awareness)

**Key finding up front:** Banglish is a real, well-documented code-mixing phenomenon (Bangla written in Roman script blended with English), but it remains a **low-resource research area** — the best published fine-tuned model hits ~67% accuracy on sentiment. Do NOT rely on a single Banglish model; use a hybrid strategy (multilingual LLM + fine-tuned adapters + Banglish-aware retrieval).

---

## 1. What "Banglish" Is

- Informal blend of Bengali and English used in Bangladesh and the diaspora, ubiquitous on social media.
- Characteristics: **Romanized Bangla** (non-standard spelling), **intra-sentential language switching**, informal grammar, heavy English slang/borrowings, culturally specific expressions.
- Adjacent concept: **Hinglish** (Hindi–English) — same class of problem, more research.

Challenges for NLP:
- Lexical variability from non-standardized spelling ("kemon acho" vs "kmn acho" vs "kemon aco").
- Syntactic irregularities that deviate from both Bengali and English norms.
- Semantic ambiguity requiring rich contextual understanding.
- Transliteration inconsistency (Bangla to Banglish → e.g., "bhath" vs "vhat").

---

## 2. Benchmarks and Published Results (sentiment analysis)

Study: Cureus (2026) — Llama 3 systematic evaluation on 11,673 posts from `Bengali_Banglish_80K`:

| Method | Accuracy |
| --- | --- |
| Llama 3 zero-shot | 43.80% |
| Llama 3 few-shot | 49.14% |
| GPT-3.5 zero-shot | 55.90% |
| GPT-4 zero-shot | 65.15% |
| Claude 3.5 zero-shot | 47.68% |
| Llama 3 dual-phase (translate→analyze) | 48.07% |
| **Llama 3 fine-tuned (LoRA, 8B)** | **66.87%** |
| Llama 3 ensemble | 66.78% |

Conclusions:
- **Fine-tuning beats zero-shot by ~23 points** — task-specific adaptation is essential for code-mixed settings.
- Translation-based pipelines **underperform** (semantic drift obscures cues) — prefer direct code-mixed modeling.
- Public artifact: `samiur-r/BanglishSentiment-Llama3-8B` (Hugging Face), trained with Unsloth, LoRA r=16, A100-80GB, ~1,000 steps.
- Zero-shot frontier models (GPT-4 ~65%) are a decent no-training baseline but not production-grade for F-commerce money paths.

---

## 3. Related Tasks & Datasets

| Resource | Task | Size | Notes |
| --- | --- | --- | --- |
| `Bengali_Banglish_80K` | Sentiment | 80K posts | Used in the Llama-3 benchmark above |
| **MixSarc** (arXiv 2026) | Humor, sarcasm, offense, vulgarity | 9,087 sentences | First public Bangla–English code-mixed corpus for implicit meaning; zero-shot LLMs get decent micro-F1 (~0.56) but low exact-match (~0.26) |
| BnSentMix (2024) | Code-mixed sentiment | — | Cited as standard text resource |
| FIRE 2025 shared task | Code-mixed IR (Banglish social text) | 20 train / 30 test queries | MAP@10 ~0.123; hybrid BM25+dense via RRF bested pure BM25 by 38% |
| RegionAware Multi-Task Transformer (IEEE WIECON-ECE 2025) | Region classification + translation quality | — | Dual BERT encoders + attention fusion; 83% region-classification accuracy |
| Shadhu–Cholito cross-script register task (IDAA 2025) | Register classification | balanced corpus | MuRIL best on Bangla script (95.9%); mBERT best on Banglish (85.7%); XLM-RoBERTa best combined (90.1%) |
| BEHE-CMDisfl (LREC 2026 workshops) | Code-mixed speech + disfluency (ASR) | ~1.3h audio | Whisper LoRA fine-tune: WER 37.7% → 21.4% — relevance if voice/WhatsApp audio messages are ever supported |

---

## 4. Recommended Architecture for the F-Commerce Platform

Do not build one "Banglish model." Compose layers:

```
incoming text (Banglish / Bangla / English)
   │
   ├─ 1. NORMALIZATION LAYER (product-specific)
   │      spelling/transliteration normalization,
   │      emoji/abbrev expansion, hashtag stripping
   │
   ├─ 2. CLASSIFIER ADAPTERS (fine-tuned, cheap, fast)
   │      intent classifier (sales/support/retention/negative)
   │      sentiment classifier (BanglishSentiment-Llama3-8B-style,
   │                            or distilled small model for latency)
   │
   ├─ 3. RETRIEVAL LAYER (Banglish-aware, RAG)
   │      hybrid vector + BM25 (RRF fusion), multilingual
   │      embeddings (e.g., Cohere embed-multilingual, mBERT-based)
   │      + Bangla→Banglish transliteration preprocessor for queries
   │
   └─ 4. GENERATION LAYER (multilingual LLM)
            strong general LLM generates the reply, instructed to
            mirror the customer's language/register (Banglish reply
            when customer writes Banglish)
```

Rationale:
- **Intent/sentiment** = classification → fine-tuned small models (fast, cheap, ~67% SOTA; combine with LLM fallback at low confidence).
- **Generation** = general multilingual LLM (GPT-4/Claude/Gemini zero-shot is fine for *producing* Banglish even if classification is hard).
- **Retrieval** = hybrid, because pure semantic search fails on transliteration variants — RRF fusion + multilingual embeddings is the published best practice (FIRE 2025, Branch8 APAC deployments).
- **Latency guardrail** (BRD: 3s fallback): classifier adapters run in ms; only route to slow LLM paths where needed; semantic cache for repeated questions.

---

## 5. Practical Data & Evaluation Notes

- Build your own labeled corpus early from real comment/DM logs (the product IS an F-commerce platform — it will generate Banglish data continuously). Curate with multi-annotator validation (following MixSarc's methodology).
- Evaluate with RAGAS-style + LLM-judge evaluation on 100+ real customer queries (Branch8 guidance) before trusting retrieval quality.
- Use few-shot LLM-assisted labeling to bootstrap datasets cheaply, then human-validate.
- Watch for **sarcasm/offense masking negative sentiment** — MixSarc found >42% of negative sentiment instances exhibit sarcastic characteristics. A naive sentiment score will be wrong on real social comments; this is exactly the BRD's "negative sentiment → escalation" trigger, so get it right.

---

## 6. Sources
- Cureus — "Sentiment Classification in Low-Resource, Code-Mixed Languages: Comparative Study of Llama 3" (2026)
- arXiv 2602.21608 — MixSarc: Bangla–English Code-Mixed Corpus for Implicit Meaning Identification (2026)
- IEEE WIECON-ECE 2025 — "Capturing Dialectal Variation in Code-Mixed Banglish through Multi-Task Transformers"
- Atlantis Press IDAA 2025 — "Shadhu-Cholito Detection Across Scripts"
- LREC 2026 — BEHE-CMDisfl (code-mixed speech/disfluency)
- FIRE 2025 — "Reciprocal Rank Fusion Based Hybrid Dense–Sparse Information Retrieval on Code-Mixed Banglish" (CEUR Vol-4173)
- Branch8 — "RAG System Implementation for E-Commerce AI Workflows" (multilingual embeddings guidance)
