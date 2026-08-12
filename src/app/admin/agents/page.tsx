"use client";

import {
  ArrowRight,
  Bot,
  ChevronRight,
  Database,
  Settings2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";

const modelOptions = [
  {
    provider: "OpenAI",
    model: "GPT-5.6 Luna",
    note: "Best for balanced sales and support responses.",
  },
  {
    provider: "Anthropic",
    model: "Claude Sonnet",
    note: "Strong for reasoning-heavy policy and instruction control.",
  },
  {
    provider: "Google",
    model: "Gemini 2.5",
    note: "Useful for multimodal and long-context retrieval flows.",
  },
];

const knowledgeBase = [
  { name: "Return policy.pdf", status: "Synced" },
  { name: "Shipping guide.md", status: "Published" },
  { name: "Catalog rules.json", status: "Verified" },
  { name: "Refund playbook.pdf", status: "Indexed" },
];

const actionChips = [
  "search_products",
  "create_payment_link",
  "get_order_status",
  "apply_discount",
  "handoff_to_human",
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-[#e7e2d7] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cde1d8] bg-[#edf7f1] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5d45]">
              <Sparkles className="h-3.5 w-3.5" />
              Single agent setup
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111827]">Configure one assistant, then deploy it cleanly</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4b5563]">
              Keep the first version simple: one assistant, multiple models, a clear system instruction,
              knowledge base grounding, and a small action surface.
            </p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#17284a] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            Deploy agent <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2463eb]">Model</div>
                <h3 className="mt-1 text-2xl font-semibold text-[#111827]">Choose the LLM</h3>
              </div>
              <Bot className="h-5 w-5 text-[#2463eb]" />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {modelOptions.map((option) => (
                <div key={option.provider} className="rounded-[1.45rem] border border-[#e7e2d7] bg-[#faf8f4] p-4">
                  <div className="text-sm font-semibold text-[#111827]">{option.provider}</div>
                  <div className="mt-2 rounded-2xl border border-[#dfe5de] bg-white px-3 py-2.5 text-sm text-[#344054]">
                    {option.model}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-[#667085]">{option.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2463eb]">System instruction</div>
                <h3 className="mt-1 text-2xl font-semibold text-[#111827]">Define how the agent should behave</h3>
              </div>
              <Wand2 className="h-5 w-5 text-[#2463eb]" />
            </div>

            <textarea
              defaultValue="You are a calm, retail-focused commerce assistant. Answer in a concise, friendly tone. Prioritize product guidance, order status, and compliant handoff. Never invent policies. If the request is risky or unclear, escalate to a human."
              className="mt-4 min-h-[160px] w-full rounded-[1.4rem] border border-[#dfe5de] bg-[#faf8f4] px-4 py-3 text-sm leading-7 outline-none"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Tone", value: "Professional, warm" },
                { label: "Fallback", value: "Human review" },
                { label: "Max tokens", value: "1200" },
                { label: "Memory", value: "Session only" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#efe8df] bg-[#faf8f4] p-3">
                  <div className="text-xs uppercase tracking-[0.14em] text-[#667085]">{item.label}</div>
                  <div className="mt-2 text-sm font-semibold text-[#111827]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2463eb]">Tools</div>
                <h3 className="mt-1 text-2xl font-semibold text-[#111827]">Allowed actions</h3>
              </div>
              <ShieldCheck className="h-5 w-5 text-[#2463eb]" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {actionChips.map((chip) => (
                <span key={chip} className="rounded-full border border-[#e7e2d7] bg-[#faf8f4] px-3 py-1.5 text-xs font-medium text-[#344054]">
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-dashed border-[#cfd6ce] bg-[#f7faf7] p-4 text-sm text-[#4b5563]">
              The tool layer should stay small and safe at first. Expand only after the first demo feels stable.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2463eb]">Knowledge base</div>
                <h3 className="mt-1 text-2xl font-semibold text-[#111827]">Upload grounding docs</h3>
              </div>
              <Database className="h-5 w-5 text-[#2463eb]" />
            </div>

            <div className="mt-4 space-y-3">
              {knowledgeBase.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between gap-3 rounded-2xl border border-[#efe8df] bg-[#faf8f4] p-3">
                  <div>
                    <div className="font-medium text-[#111827]">{doc.name}</div>
                    <div className="mt-1 text-xs text-[#667085]">Retail policy and support grounding</div>
                  </div>
                  <div className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                    {doc.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-dashed border-[#cfd6ce] bg-[#f7faf7] p-4 text-sm text-[#4b5563]">
              <UploadCloud className="mb-2 h-5 w-5 text-[#2463eb]" />
              Drag and drop documents here or add FAQ, policy, and catalog files.
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2463eb]">Preview</div>
                <h3 className="mt-1 text-2xl font-semibold text-[#111827]">Test prompt</h3>
              </div>
              <Settings2 className="h-5 w-5 text-[#2463eb]" />
            </div>

            <div className="mt-4 rounded-[1.4rem] bg-[#17284a] p-4 text-white">
              <div className="text-xs uppercase tracking-[0.2em] text-[#94a3b8]">User message</div>
              <div className="mt-2 text-sm leading-7 text-[#e5ecf5]">I want to know if the blue kurti is available in large and can you share a payment link?</div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[#94a3b8]">Expected response</div>
                <div className="mt-2 text-sm leading-7 text-[#dbe4f0]">Provide availability, answer briefly, and generate a checkout link only if policy passes.</div>
              </div>
            </div>

            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#17284a] px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Save configuration
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#2463eb]">Deployment</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Status", value: "Draft" },
                { label: "Last deploy", value: "Never" },
                { label: "Environment", value: "Demo" },
                { label: "Escalation", value: "Enabled" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#efe8df] bg-[#faf8f4] p-3">
                  <div className="text-xs uppercase tracking-[0.14em] text-[#667085]">{item.label}</div>
                  <div className="mt-2 text-sm font-semibold text-[#111827]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
