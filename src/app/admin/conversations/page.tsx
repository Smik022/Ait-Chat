const threads = [
  { customer: "Tasnim Rahman", channel: "Instagram", last: "Need price for saffron kurti", status: "sales" },
  { customer: "Rafiul Islam", channel: "WhatsApp", last: "Tracking update please", status: "support" },
  { customer: "Shakil Ahmed", channel: "Facebook", last: "Refund request for order #9281", status: "manager" },
  { customer: "Nusrat Jahan", channel: "Instagram", last: "Can I get a 10% offer?", status: "retention" },
];

const filters = ["All", "Priority", "Sales", "Support", "Retention", "Refunds"];

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Inbox</div>
            <h2 className="mt-1 text-2xl font-semibold text-[#111827]">Conversations</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filter === "All"
                    ? "bg-[#0e5a43] text-white"
                    : "border border-[#e7e2d7] bg-[#faf8f4] text-[#374151]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {threads.map((thread) => (
              <div key={thread.customer} className="rounded-[1.2rem] border border-[#efe8df] bg-[#faf8f4] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-[#111827]">{thread.customer}</div>
                    <div className="mt-1 text-xs text-[#667085]">{thread.channel}</div>
                  </div>
                  <span className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                    {thread.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#4b5563]">{thread.last}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Thread preview</div>
          <h3 className="mt-2 text-xl font-semibold text-[#111827]">Tasnim Rahman</h3>
          <div className="mt-4 space-y-3 text-sm text-[#4b5563]">
            <div className="rounded-2xl bg-[#f7f5f1] p-3">Hi, do you have this in red and black?</div>
            <div className="rounded-2xl bg-[#0e5a43] p-3 text-white">Yes, we have two sizes left. I can send the checkout link.</div>
            <div className="rounded-2xl bg-[#f7f5f1] p-3">Perfect, please share the link and measure.</div>
          </div>
          <button type="button" className="mt-5 rounded-full bg-[#0e5a43] px-4 py-2 text-sm font-semibold text-white">
            Open live reply draft
          </button>
        </div>
      </section>
    </div>
  );
}
