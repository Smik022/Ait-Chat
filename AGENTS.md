<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Ait-Chat

## What this is

A **working prototype** of a social-commerce platform for Bangladesh: an AI agent
workforce that answers comments and DMs on Instagram, Messenger and WhatsApp,
quotes live stock, takes the order, and escalates to a person when it should not
decide alone.

It is a demonstration. **There is no backend, no live integration, no customer,
and no real metric anywhere in it.** Every conversation, order, merchant and
figure on screen is authored demo material. Read `PRODUCT.md` before making
product decisions; it holds the confirmed product truth and the constraints.

The nine documents in `research/` are real research (August 2026) into Meta's
messaging APIs, multi-agent orchestration, Banglish NLP, e-commerce platforms,
competitors, RAG and guardrails. Note that the platform-integration research is
now background only: this product is built for sellers who have no store
software at all, so the catalogue lives inside Ait-Chat. They are the source of the domain facts the
interface asserts. If you need to know why something works the way it does, the
answer is usually in there.

## The two rules that matter most

**1. Never fabricate proof.** No invented customer logos, testimonials, press,
certifications, awards, uptime figures, funding, or achieved results. Figures
from published research may appear **only** where they are labelled as industry
benchmarks and carry their source on screen. Use `benchmarkFor(label)` from
`src/lib/data.ts` and the `BenchmarkNote` primitive, which renders the source
alongside the claim. Authoring illustrative demo content is fine and expected;
asserting commercial fact is not.

**2. There is no server.** `output: "export"` in `next.config.ts`. No API routes,
no database, no server actions, no runtime environment variables. Everything
interactive runs client-side in React over local data. If a feature seems to need
a backend, it needs a client-side simulation instead.

## Layout

```
src/lib/data.ts        The entire demo world. Single source of truth.
src/lib/live.tsx       Client-side simulation engine (the "live" behaviour).
src/components/
  primitives.tsx       Shared design-system pieces. Use these, do not re-roll them.
  brand-logos.tsx      Channel and provider marks. Read the header comment.
  command-menu.tsx     Cmd-K palette.
  logo.tsx             LogoMark, also the source of src/app/icon.svg.
  ui/                  shadcn components, built on @base-ui/react (NOT Radix).
src/app/
  page.tsx             Landing page. Persuade register, larger type scale.
  layout.tsx           Root layout. Fonts, theme provider, direction contract.
  globals.css          Design tokens. Change colour here, nowhere else.
  admin/
    layout.tsx         Shell: sidebar, topbar, live toggle, command palette.
    page.tsx           Overview
    inbox/             Three-pane omnichannel inbox
    comments/          Comment-to-DM engine
    agents/            Agent configuration (model, instructions, permissions)
    guardrails/        Rules you can add, switch off, delete
    knowledge/         Retrieval walkthrough
    orders/            Order ledger with fulfilment timelines
    integrations/      Connectors and their permission scopes
research/              Domain research. Read before asserting a domain fact.
PRODUCT.md             Product truth, users, positioning, constraints.
```

## How the demo works

**All content comes from `src/lib/data.ts`.** Agents, products, orders,
conversations with full message threads, post comments, knowledge documents,
guardrail rules, the action catalogue, analytics series and integrations. Add or
change demo material there, not inline in a page.

**`src/lib/live.tsx` makes it feel alive.** `LiveProvider` wraps the admin layout
and replays a **deterministic** scripted sequence: gateway decisions land every
3.4s, counters advance, agents change state. Deterministic is deliberate, so the
demo can be walked through repeatedly without surprises. `useLive()` exposes
`events`, `metrics`, `beat` and a play/pause control. `useMounted()` and
`usePrefersReducedMotion()` are `useSyncExternalStore` based, so they are correct
on first paint and do not trip the `set-state-in-effect` lint rule.

Anything time-dependent must render identically on the server and on first
client paint, or hydration breaks. Gate it behind `useMounted()`.

## Design system

Tokens live in `src/app/globals.css`. **Colour means something here, so do not
pick hues freely.**

| Token | Meaning |
|---|---|
| `--live` | allowed, paid, delivered, healthy |
| `--pend` | pending, awaiting approval, needs review |
| `--block` | blocked, refused, failed, negative |
| `--route` | routing, informational |
| `--machine` | machine authorship, an agent did this rather than a person |

Each has a `-soft` background and an `-ink` foreground; use those together for
chips and callouts. Solid `--primary` green means "this is the action". Soft
green tint means "paid or allowed". Do not blur that distinction.

- No neutral sits at zero chroma. Flat grey reads as clinical.
- Hairline borders, no shadows except on popovers. No gradients as decoration,
  no glass, no gradient text.
- 8px base radius, compact density, tabular numerals on every quantity.
- Never put an eyebrow or kicker label above a heading.
- Icons come from `lucide-react`. Never a unicode glyph or emoji standing in for
  one.
- Measure contrast, do not eyeball it. Everything currently clears WCAG AA in
  both themes, tightest pair 4.88:1.

The direction contract is an HTML comment at the top of `<body>` in
`src/app/layout.tsx`, seed `f1424203`. It survives the production build. Read it
before changing the visual direction.

## Language and typography

This product is bilingual for real reasons, and there are traps:

- **`৳` (U+09F3) does not exist in Inter or Geist Mono.** Noto Sans Bengali sits
  in both font stacks so the taka sign resolves properly. Do not remove it.
- **Bengali script** gets `data-script="bengali"`, which applies a 1.75
  line-height. Its ascenders and below-base marks make single-line ink 19 to 52
  percent taller than Latin, and at Latin leading the lines collide.
- **Never letter-space Bengali.** Words are joined by the matra, a continuous
  headstroke, and tracking punches holes through it.
- **Banglish is Latin script**, so it is `lang="bn-Latn"`, not `lang="bn"`. Use
  the `langTag()` helper in `src/lib/data.ts`.
- **Banglish spellings vary on purpose.** One customer writes `ache`, another
  writes `ase`. Normalising that variance is what the classifier is for, so the
  demo data must contain it. Do not tidy it up.

## Copy rules

- **No em dashes.** There are currently zero under `src/`, and it should stay that
  way. Use a full stop, a comma, a colon, or rewrite the sentence. The only ones
  in the repo are inside the generated block at the top of this file, which is not
  ours to edit.
- **Never say "tool" or "tool call" in the interface.** Users see **actions**.
  `actionLabel()` in `src/lib/data.ts` maps internal names to plain language:
  `get_order_status` renders as "Check an order".
- Write like the product, not like marketing. Name the thing, state what happens.
- Controls name their action. Errors name the problem and the recovery.

## Deployment

Published to GitHub Pages as a **project page** at
`https://asifahmed.me/Ait-Chat/`. The apex `asifahmed.me` belongs to a separate
personal site repo.

- `basePath` is set to `/Ait-Chat` **for production builds only**. `next dev`
  stays on `/`, so local URLs are unaffected. Override with
  `NEXT_PUBLIC_BASE_PATH` if the hosting path changes.
- **Do not add `public/CNAME`.** One used to exist claiming `asifahmed.me`, which
  would take that domain away from the personal site. It was removed deliberately.
- `.github/workflows/deploy.yml` builds and deploys on push to `main`.

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # static export into out/
npm run lint
```

The lint rules are strict about React hooks, in particular
`react-hooks/set-state-in-effect`. Prefer `useSyncExternalStore`, or adjust state
during render using the documented pattern, rather than calling a setter directly
in an effect body.

`.impeccable/` is design-tooling scratch and is gitignored.

## Known gaps

- No `apple-icon.png`, so an iOS home-screen shortcut shows a screenshot rather
  than the logo. Needs a 180x180 PNG export.
- Brand marks in `brand-logos.tsx` are drawn by hand, not official assets. Read
  the header comment there before this goes anywhere public.
- No `DESIGN.md` yet.
