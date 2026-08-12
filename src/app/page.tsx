import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const stats = [
  { label: "Response time", value: "1.1s" },
  { label: "DM conversion", value: "12.3%" },
  { label: "Orders assisted", value: "1.28K" },
  { label: "CSAT", value: "4.7/5" },
];

const pillars = [
  {
    title: "Conversation-first sales",
    text: "Capture comments and DMs, qualify intent, and move shoppers into a guided checkout flow.",
    icon: MessageSquareText,
  },
  {
    title: "Supervisor orchestration",
    text: "Route every conversation through a clear worker model: router, specialist, manager, then human.",
    icon: Workflow,
  },
  {
    title: "Guardrail-safe actions",
    text: "Refunds, discounts, and data changes pass through policy checks before anything executes.",
    icon: ShieldCheck,
  },
];

const steps = [
  {
    title: "1. Capture",
    text: "A comment, DM, or support message enters a single queue from Instagram, Facebook, WhatsApp, or web.",
  },
  {
    title: "2. Route",
    text: "The router classifies intent, language, and urgency, then assigns the right specialist.",
  },
  {
    title: "3. Resolve",
    text: "The worker answers, retrieves policy or order data, and proposes the next best action.",
  },
  {
    title: "4. Escalate",
    text: "Manager review or human handoff is available whenever the request is risky or ambiguous.",
  },
];

const trustItems = [
  "Built for social commerce",
  "Banglish-aware routing",
  "Human approval when needed",
  "Designed for retail operators",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#e5ddd0] bg-[#fbfaf7]/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e5a43] text-sm font-bold text-white">
              A
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight sm:text-base">Ait-Chat</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#6b7280]">Social Commerce OS</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#4b5563] md:flex">
            <a href="#platform" className="transition hover:text-[#111827]">Platform</a>
            <a href="#workflow" className="transition hover:text-[#111827]">Workflow</a>
            <a href="#proof" className="transition hover:text-[#111827]">Proof</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-[#0e5a43] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b4d39]"
            >
              View demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#e7ded0]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,90,67,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(181,131,72,0.14),_transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cde1d8] bg-[#edf7f1] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5d45]">
              <Sparkles className="h-3.5 w-3.5" />
              Designed for real commerce teams
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-[#101828] sm:text-5xl lg:text-6xl">
              A calm, professional front door for your AI sales and support system.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#4b5563]">
              Ait-Chat helps retail teams turn comments, DMs, and support messages into structured
              conversations, guided purchases, and safe escalations across Instagram, Facebook,
              WhatsApp, and the web.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0e5a43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4d39]"
              >
                Open admin demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d2c7] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f7f5f0]"
              >
                See workflow
              </a>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[#e6ddd0] bg-white/80 p-4 shadow-sm">
                  <div className="text-2xl font-semibold text-[#111827]">{stat.value}</div>
                  <div className="mt-1 text-sm text-[#667085]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ddd4c6] bg-[#fcfbf8] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="rounded-[1.5rem] border border-[#e8e0d3] bg-white p-5">
              <div className="flex items-center justify-between border-b border-[#eee4d7] pb-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7280]">Live snapshot</div>
                  <div className="mt-1 text-lg font-semibold text-[#111827]">Inbox control room</div>
                </div>
                <div className="rounded-full bg-[#edf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0d5d45]">
                  online
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { label: "Tasnim Rahman", meta: "Instagram comment · product inquiry" },
                  { label: "Rafiul Islam", meta: "WhatsApp DM · order status" },
                  { label: "Shakil Ahmed", meta: "Facebook message · refund review" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#ece4d8] bg-[#faf8f4] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-[#111827]">{item.label}</div>
                        <div className="mt-1 text-xs text-[#667085]">{item.meta}</div>
                      </div>
                      <BadgeCheck className="h-4 w-4 text-[#0d5d45]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-[#0f172a] p-4 text-white">
                <div className="text-xs uppercase tracking-[0.2em] text-[#9ca3af]">Demo trigger</div>
                <div className="mt-2 text-xl font-semibold">Comment: “price?”</div>
                <div className="mt-2 text-sm text-[#d1d5db]">
                  Router detects buying intent, Sales prepares a response, and the admin dashboard shows the handoff.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0d5d45]">Platform</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Clear product structure, not generic marketing noise</h2>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {pillars.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-[1.75rem] border border-[#e7dfd3] bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf7f1] text-[#0d5d45]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#111827]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#4b5563]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="border-y border-[#e7ded0] bg-[#faf8f4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0d5d45]">Workflow</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">A familiar operating rhythm for real teams</h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.title} className="rounded-[1.5rem] border border-[#e7dfd3] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">
                  <Clock3 className="h-3.5 w-3.5 text-[#0d5d45]" />
                  {step.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#4b5563]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="rounded-[1.9rem] border border-[#e7dfd3] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0d5d45]">
              <BarChart3 className="h-4 w-4" />
              What the demo shows
            </div>
            <div className="mt-5 space-y-3">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#ece4d8] bg-[#faf8f4] px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#0d5d45]" />
                  <span className="text-sm font-medium text-[#374151]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-[#0e5a43] bg-[#0e5a43] p-6 text-white shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c8eadf]">Ready for the dashboard</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Open the admin demo to see the real workflow layout.</h2>
            <p className="mt-4 text-sm leading-7 text-[#d7efe6]">
              The landing page stays clean and credible. The admin area carries the operational details: conversations,
              agents, orders, payments, operations, and integrations.
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#f2f5f7]"
            >
              Launch live admin dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
