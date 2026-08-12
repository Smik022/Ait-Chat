const stats = [
  { label: "Conversations today", value: "1,284", delta: "+23%" },
  { label: "DM conversion", value: "12.3%", delta: "+2.1%" },
  { label: "Revenue attributed", value: "৳40,200", delta: "+34.2%" },
  { label: "Containment", value: "87.4%", delta: "+6.8%" },
];

const conversations = [
  { customer: "Tasnim Rahman", channel: "Instagram", intent: "product inquiry", status: "sales agent" },
  { customer: "Rafiul Islam", channel: "WhatsApp", intent: "order tracking", status: "support agent" },
  { customer: "Shakil Ahmed", channel: "WhatsApp", intent: "refund review", status: "manager review" },
  { customer: "Nusrat Jahan", channel: "Instagram", intent: "abandoned cart", status: "retention agent" },
];

const orderRows = [
  { id: "ORD-9317", customer: "Rafiul Islam", product: "Chaya Cotton Kurti", amount: "৳2,580", status: "shipped" },
  { id: "ORD-9316", customer: "Tasnim Rahman", product: "Dhakai Jamdani Saree", amount: "৳3,890", status: "processing" },
  { id: "ORD-9315", customer: "Nusrat Jahan", product: "Tangail Cotton Saree", amount: "৳2,190", status: "delivered" },
];

const agentCards = [
  { name: "Router", focus: "Intent + sentiment routing", state: "online" },
  { name: "Sales", focus: "Quote + checkout", state: "busy" },
  { name: "Support", focus: "Orders + returns", state: "online" },
  { name: "Manager", focus: "Approvals + human handoff", state: "online" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#667085]">{stat.label}</div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="text-2xl font-semibold tracking-tight text-[#111827]">{stat.value}</div>
              <div className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                {stat.delta}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Live queue</div>
                <h2 className="mt-1 text-xl font-semibold text-[#111827]">Priority conversations</h2>
              </div>
              <button type="button" className="text-sm font-medium text-[#0d5d45]">View all</button>
            </div>

            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div key={conversation.customer} className="rounded-[1.2rem] border border-[#efe8df] bg-[#faf8f4] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-[#111827]">{conversation.customer}</div>
                      <div className="mt-1 text-xs text-[#667085]">{conversation.channel} • {conversation.intent}</div>
                    </div>
                    <div className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                      {conversation.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Recent orders</div>
                <h2 className="mt-1 text-xl font-semibold text-[#111827]">Latest transactions</h2>
              </div>
              <button type="button" className="text-sm font-medium text-[#0d5d45]">Open ledger</button>
            </div>

            <div className="overflow-hidden rounded-[1.2rem] border border-[#efe8df]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f9f8f4] text-[#4b5563]">
                  <tr>
                    <th className="px-3 py-3 font-medium">Order</th>
                    <th className="px-3 py-3 font-medium">Customer</th>
                    <th className="px-3 py-3 font-medium">Product</th>
                    <th className="px-3 py-3 font-medium">Amount</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderRows.map((row) => (
                    <tr key={row.id} className="border-t border-[#f0eae1] bg-white">
                      <td className="px-3 py-3 font-medium text-[#111827]">{row.id}</td>
                      <td className="px-3 py-3">{row.customer}</td>
                      <td className="px-3 py-3">{row.product}</td>
                      <td className="px-3 py-3 font-medium">{row.amount}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Agent health</div>
                <h2 className="mt-1 text-xl font-semibold text-[#111827]">Worker stack</h2>
              </div>
              <div className="rounded-full bg-[#edf7f1] p-2 text-[#0d5d45]">●</div>
            </div>

            <div className="mt-4 space-y-3">
              {agentCards.map((agent) => (
                <div key={agent.name} className="rounded-[1.2rem] border border-[#efe8df] bg-[#faf8f4] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-[#111827]">{agent.name}</div>
                      <div className="mt-1 text-xs text-[#667085]">{agent.focus}</div>
                    </div>
                    <span className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                      {agent.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Automation health</div>
                <h2 className="mt-1 text-xl font-semibold text-[#111827]">Policy checks</h2>
              </div>
              <div className="rounded-full bg-[#edf7f1] p-2 text-[#0d5d45]">↗</div>
            </div>

            <div className="mt-4 space-y-4">
              {[
                { label: "Refund approvals", value: "21 / 24" },
                { label: "Discount ceiling checks", value: "100%" },
                { label: "PII redaction", value: "99.8%" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-[#374151]">
                    <span>{item.label}</span>
                    <span className="font-medium text-[#111827]">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f1efe9]">
                    <div
                      className="h-2 rounded-full bg-[#0e5a43]"
                      style={{ width: item.label.includes("Refund") ? "88%" : item.label.includes("Discount") ? "100%" : "99%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Latest actions</div>
            <h2 className="mt-1 text-xl font-semibold text-[#111827]">Tool gateway events</h2>
          </div>
          <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-[#0d5d45]">
            More details →
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { title: "get_order_status", detail: "ORD-9316 → shipped · tracking confirmed" },
            { title: "create_payment_link", detail: "Cart CV-221 → checkout link generated" },
            { title: "apply_discount", detail: "Blocked by policy; Manager approval required" },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-[#efe8df] bg-[#faf8f4] p-3">
              <div className="text-sm font-semibold text-[#111827]">{item.title}</div>
              <div className="mt-2 text-sm text-[#4b5563]">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
