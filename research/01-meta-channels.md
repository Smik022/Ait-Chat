# Meta Channels Research — Instagram, Facebook Messenger, WhatsApp Business Platform

**BRD relevance:** §1.3 (Comment-to-DM, Social Automation), §3 (differentiators), §5 (Channel Webhook Layer), §7 (Meta Policy Compliance)

**Key finding up front:** Instagram DMs, Facebook Messenger, and WhatsApp all run on the **same Meta graph infrastructure** (`graph.facebook.com`) with the same authentication and webhook model. "Instagram Messaging API" is not a separate API — it is the DM-specific subset of the Instagram Graph API. This means one webhook layer can serve all channels.

---

## 1. Platform Architecture

- **Instagram Graph API (v21+)**: the only current Instagram API (legacy `api.instagram.com` shut down March 2020). DMs are a subset of it.
- **Messenger Platform**: Page-scoped conversations via the same Send API.
- **WhatsApp Business Cloud API**: standalone API but same webhook delivery + Graph API auth concepts. Charged per template message delivered (per-message pricing effective July 1, 2025).

### Two integration paths for Instagram
| Path | Login | Host | Tokens | Notes |
| --- | --- | --- | --- | --- |
| Instagram API with Facebook Login | Facebook Login for Business | `graph.facebook.com` | Page access token | Instagram account linked to a Facebook Page; Messenger-style messaging |
| Instagram API with Instagram Login | Business Login for Instagram | `graph.instagram.com` | Instagram User access token | For professional accounts NOT linked to a Page |

For a multi-channel platform (BRD covers IG + FB + WhatsApp), the **Facebook Login path is the correct choice** — one app, one Page access token, one webhook server.

---

## 2. Webhook Layer (receiving)

Subscription fields that matter:

| Field | Event | Used for |
| --- | --- | --- |
| `messages` | Customer sends DM (text/media/share/story reply/quick reply) | Core conversation intake |
| `comments` / `live_comments` | Comment on a post/reel/ads post | Comment-to-DM trigger detection |
| `messaging_referrals` | Story mention / `ig.me` link click / CTD ad click | Referral-based flows |
| `messaging_postbacks` | Button/quick-reply click | Menu-driven navigation |
| `messaging_optins` | Recurring-notification opt-in | Marketing opt-in proof |
| `standby` | Message arrives while another app controls conversation | Handover Protocol |

Payload shape (Instagram messaging):
```json
{
  "object": "instagram",
  "entry": [{
    "id": "IGID",
    "time": 1569262486134,
    "messaging": [{
      "sender": { "id": "IGSID" },
      "recipient": { "id": "IGID" },
      "timestamp": 1569262485349,
      "message": {
        "mid": "MESSAGE-ID",
        "text": "MESSAGE-TEXT",
        "attachments": [{ "type": "image", "payload": { "url": "LINK" } }]
      }
    }]
  }]
}
```

### Required permissions (Instagram messaging)
- `instagram_manage_messages` — DM webhooks + sending
- `pages_messaging` — without this, IG DM webhooks do not fire
- `pages_read_engagement` / `instagram_manage_comments` — comment reading (needed for comment-to-DM)
- App Review + published app required for production webhooks on real users

---

## 3. Comment-to-DM Engine (FR-01, FR-02)

Mechanics confirmed by Meta docs (private replies):
1. `comments` webhook fires on a new comment (includes commenter IG-scoped ID, comment text, media ID).
2. App sends `POST /{app-user-ig-id}/messages` with `recipient: { comment_id }` and `message: { text }`.
3. Response contains `recipient_id` (IGSID) and `message_id`.

**Hard constraints — critical for product design:**
- **Only one message** can be sent per comment (no multi-message auto-follow-up).
- Must be sent within **7 days** of the comment (for Live, only during the broadcast).
- The private reply automatically includes a link to the commented post.
- **A 24-hour messaging window opens only after the customer responds.** Until then, no further automated DMs.
- Keyword and non-keyword trigger detection (FR-02) is a product-layer concern: detect keyword (e.g., "PRICE") or semantic intent from the comment text, then fire the single allowed private reply.

### Messenger-side equivalent
Comment on a Facebook Page post → `comments` webhook → `POST /{PAGE_ID}/messages` with `recipient: { comment_id }`. Same rules.

### Recommended trigger stack
```
comments webhook → dedupe (comment_id) → intent/keyword classifier (multi-lingual)
  → guardrail check (opt-in, rate limit, sentiment) → single private reply DM
  → store conversation reference → wait for 24h window to open on reply
```

---

## 4. Messaging Windows (FR-08, §7 Meta Policy Compliance)

### Standard messaging window (Instagram + Messenger)
- Opens when the person messages the Page/Professional account (also via: Send to Messenger plugin, `m.me`/`ig.me` link clicks, message reactions, post comments, visitor posts).
- **24 hours** to respond.
- Outside the window: only human-agent tagged messages (approved tags) can be sent.
- App Mute: user can mute conversations; repeated "spammy" behavior triggers feedback.

### WhatsApp customer service window (CSW)
- Opens on the customer's first inbound message (or call) to the business number; **resets only on a genuine customer reply** (a sent template does not reopen it).
- Inside CSW: free-form service messages allowed, free of charge; utility templates free inside window.
- Outside CSW: **only pre-approved message templates** — categories:
  - **Utility** (order status, delivery) — cheapest, free if delivered inside an open CSW
  - **Authentication** (OTPs) — lowest flat rate
  - **Marketing** (promos, win-back) — highest per-message rate, strictest review
- **Free Entry Point (FEP) window**: 72 hours if the user arrives via a Click-to-WhatsApp ad or Facebook Page CTA (mobile apps only); all message types free within it.
- Template lifecycle: in-review (≤24h) → approved → active; quality feedback can pause; inactive 12 months → archived then deleted.
- Per-Business-Portfolio messaging limits (2025+) replace per-number limits (verified portfolios ~2,000/day new-contact templates).

### Design implications for §7 "Autonomous Abandoned-Cart / Restock Recovery"
- **IG/Messenger**: proactive outreach outside the 24h window is **not allowed** (except tagged human-agent sends). Recovery messaging must happen inside an open window — i.e., right after engagement or via retargeting ads, not later.
- **WhatsApp**: abandoned-cart/restock outreach outside CSW requires an **approved marketing/utility template** + valid opt-in, and costs per template. Recovery flows should be built as templates and gated by consent tracking.

---

## 5. Sending (outbound)

- Endpoint: `POST /v21.0/{ig-user-id}/messages` (Instagram) or `/{PAGE_ID}/messages` (Messenger). Same payload style.
- Message types: text, quick replies, generic templates, media share, buttons, attachments (audio/video/file), reactions.
- Message tags: `HUMAN_AGENT`, `SHIPPING_UPDATE`, `PAIRING_UPDATE`, etc. allow sending outside standard windows for specific use cases only.
- `is_echo: true` marks messages the business sent (for dedupe/sync).

---

## 6. Human Handoff (FR-08)

Meta requires **every automated messaging app to have a human-agent escalation path**. Two options:
1. **Single App** — custom inbox in the same app handles human replies.
2. **Multiple Apps — Handover Protocol** — pass conversation control between an automation app and a human-inbox app via `pass_thread_control` / `take_thread_control` / `request_thread_control`; secondary app receives `standby` webhooks while not in control.

This maps exactly to the BRD's Manager Agent → Human Agent Inbox. The BRD's enrichment (sentiment score + summary + context) is a product-layer addition — the protocol provides the mechanism, the platform provides the payload.

---

## 7. Meta Policy Compliance Checklist (for §7)

- [x] Respect 24-hour standard messaging windows (IG/Messenger) and CSW (WhatsApp).
- [x] Comment-to-DM: one message, within 7 days, with post link appended.
- [x] WhatsApp outside-window sends only via approved templates with correct category + valid opt-in.
- [x] Opt-in proof stored per user (WhatsApp policy: "a form fill alone doesn't satisfy consent").
- [x] Human-agent escalation path always available and advertised.
- [x] Track template quality feedback; avoid marketing-template abuse (category misuse → instant utility→marketing reclassification, rate-limiting, restriction).
- [x] Avoid rate-limit errors (WhatsApp Error 131047 = free-form send outside window).

---

## 8. Meta Compliance Ecosystem (partner status)

- **Official Meta Business Partner** / **Meta Tech Provider** / **Meta Graph API partner** certifications exist for comment-to-DM tools — a trust signal and API-stability marker for any competitor-positioning or go-to-market claims.
- Meta reviews apps; consumer-messaging features require App Review + Advanced Access.

---

## Sources
- Meta for Developers — Instagram Platform: Private Replies (private-replies)
- Meta for Developers — Messenger Platform: Send Messages, Overview, Webhooks
- Meta for Developers — Instagram Messaging Overview (Human Agent / Handover Protocol)
- Meta for Developers — WhatsApp Cloud API: Send Messages, Message Templates, Pricing (July 2025 per-message model), Business Policy
- SocialHook — "Instagram Messaging API vs Instagram Graph API" (API relationship clarification)
- ask4lead — "WhatsApp Business 24 Hour Rule: 2026 Guide"
- ManyChat Pricing page (Meta-approved partner; March 2026 restructure)
- ReplyRush — "Best Comment-to-DM Automation Tools (2026 Guide)"
