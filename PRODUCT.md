# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the F-commerce merchant operator.** A Bangladeshi retail brand running sales through Instagram, Facebook Pages, and WhatsApp rather than (or alongside) a storefront. One to five people handle everything: replying to comments on a new post, answering "price?" fifty times, quoting sizes, taking orders in DMs, chasing delivery status, and processing returns. They are overwhelmed at exactly the moment they are succeeding — a post goes viral and the inbox becomes unanswerable.

**Secondary: the human agent inside that team.** Works an inbox, needs escalated conversations to arrive with context already attached, and needs to take over a conversation mid-flight without the customer noticing a seam.

The job: convert social attention into completed, paid, delivered orders without hiring proportionally to volume — and without violating Meta's messaging rules while doing it.

## Product Purpose

Ait-Chat is an AI agent workforce for social commerce. It watches comments and DMs across Instagram, Messenger, WhatsApp, and web chat; classifies intent, language, and sentiment; routes each conversation to a specialist agent; lets that agent take real commerce actions (search catalog, check live stock, look up an order, generate a checkout link) through a policy-checked gateway; and escalates to a human when the request is risky, ambiguous, or explicitly demanded.

Success is a conversation that ends in a paid order, or in a human taking over with full context — never in a customer waiting, and never in an agent doing something the merchant did not authorize.

## Positioning

The market splits into two camps that do not overlap: **social acquisition** tools (ManyChat and the comment-to-DM cohort) that fire one pre-written reply and stop, and **e-commerce support** helpdesks (Gorgias et al.) that resolve tickets but own no acquisition funnel. Merchants run both and stitch them together.

Ait-Chat's claim is the seam itself: one platform where the comment that starts the conversation and the refund that ends it are the same thread, handled by a coordinated agent workforce, in the customer's actual language — including Banglish, which neither camp handles.

Two mechanisms a neighboring product cannot truthfully copy today:

1. **Comment-to-conversation-to-checkout as one continuous, auditable thread**, with the Meta messaging-window rules enforced in the system rather than left to the operator.
2. **A guardrail-protected tool gateway** where the model proposes structured tool calls and a deterministic policy layer decides — so a discount over ceiling is *blocked and routed*, visibly, rather than trusted.

## Operating Context

- **Channels:** Instagram (comments, DMs, story replies), Facebook Messenger, WhatsApp Business Cloud API, web chat. All four are webhook-driven; Meta's three run on the same graph infrastructure.
- **Hard platform rules that shape the product:** a private reply to a comment is a single message within 7 days; a 24-hour messaging window opens only when the customer responds; WhatsApp requires approved templates outside its customer-service window; every automated messaging app must offer a human escalation path.
- **Commerce systems:** Shopify Admin API and WooCommerce REST v3 as sources of truth for catalog, stock, and orders. Live transactional data is fetched, never embedded in a vector store.
- **Local commerce reality:** ৳ BDT pricing, cash on delivery as a first-class payment path alongside bKash and Nagad, Pathao-style courier tracking, Dhaka/outside-Dhaka delivery split.
- **Language reality:** customers write Bangla in Bengali script, Bangla in Roman script (Banglish), English, and code-switch mid-sentence. Published Banglish sentiment accuracy tops out around 67%, so confidence must be visible and low confidence must not drive money decisions.

## Capabilities and Constraints

**Core capabilities the demo must represent (from the BRD and research/):**

- Comment-to-DM engine — keyword and semantic intent triggers on post comments, one compliant private reply
- Multi-agent orchestration — Router → Sales / Support / Retention / Operations → Manager → human handoff
- Guardrail-protected tool gateway — allowlist, schema validation, RBAC by agent role, policy ceilings, PII masking, approval interrupts, audit trail
- Live order tracking by order ID or phone number
- Knowledge base / RAG grounding over policies, FAQs, sizing guides, catalog copy
- Localized NLP — Banglish/Bangla/English intent, sentiment, and language-mirrored replies
- Omnichannel inbox with human takeover

**Technical constraints:**

- Next.js 16 App Router, React 19, Tailwind v4, static export (`output: "export"`), deployed to GitHub Pages at `asifahmed.me`. **No server, no API routes, no database.** Every interactive behavior must run client-side against local data.
- Existing component layer is shadcn on `@base-ui/react` (not Radix).

## Brand Commitments

- **Name:** Ait-Chat. Positioned as a social commerce operating system.
- **Existing asset:** the `LogoMark` in `src/components/logo.tsx` — a deep-green gradient tile with an "A" monogram. The green is the one inherited colour with authority.
- **Visual direction (standing preference, chosen 2026-08-12):** the **category standard** — the modern SaaS product dashboard — taken deliberately over four dealt alternative worlds. It is to be executed at full fidelity: no irony, no pastiche, and no smuggled motifs from the unchosen directions. Familiarity is the point; craft is where it earns its keep.
- **Craft bar (the standard this is measured against):**
  - **Linear + Vercel** set the shell — density, alignment discipline, near-invisible chrome, motion in the 100–150ms band.
  - **Stripe** sets anything involving money — tabular numerals, tables as the hero, exactness over decoration.
  - **Intercom Fin + Gorgias** set the inbox — AI-versus-human authorship always obvious, confidence and sentiment inline, handoff as a first-class moment.
- No other palette, typeface, or visual system carries authority.

## Evidence on Hand

**Real:** the nine research documents in `research/` — genuine August 2026 research against vendor documentation, published papers, and market analysis. Real, citable facts available to the product: Meta's private-reply and messaging-window mechanics; published Banglish NLP benchmarks (~67% fine-tuned sentiment accuracy, GPT-4 zero-shot ~65%); competitor pricing structures; industry benchmarks the research names as targets to plan against (75–90% containment, ~12.3% DM conversion, 30–35% abandoned-cart recovery).

**Not real — must never be presented as fact:**

- There are no customers, no pilot merchants, no live deployments, and no production metrics.
- No integration is actually connected; no Shopify store, Meta app, or WhatsApp number is live.
- Every merchant, customer, conversation, order, and number in the interface is an illustrative demonstration scenario.
- No testimonials, customer logos, press mentions, certifications, awards, uptime figures, or funding claims exist. None may be invented or implied.

Industry benchmarks from the research may appear **only** when labeled as industry benchmarks or targets, never as this product's achieved results.

## Product Principles

1. **The seam is the product.** Anything that shows one continuous thread from public comment to paid order beats anything that shows a feature in isolation.
2. **Show the refusal.** The guardrail is only believable when someone watches a tool call get blocked. Safety demonstrated beats safety asserted.
3. **Ground truth is fetched, never remembered.** Order status and stock come from live systems; policy and catalog copy come from the knowledge base. Never blur the two.
4. **Confidence is a first-class value.** Language, intent, and sentiment are probabilistic — surface the score, and let low confidence route to a human instead of guessing.
5. **Local depth, portable architecture.** Bangladesh is the first market, not the ceiling: honor ৳, Banglish, COD, and courier reality concretely, while keeping every channel and commerce adapter swappable.

## Accessibility & Inclusion

- Bilingual content is a functional requirement, not a nicety: Bengali script, Romanized Bangla, and English appear side by side in real customer messages and must all render correctly and legibly.
- Standard target: WCAG 2.2 AA for contrast, focus visibility, and keyboard operability.
