const operations = [
  { label: "Checkout automation", value: "96%" },
  { label: "Policy enforcement", value: "99%" },
  { label: "Inventory sync", value: "98%" },
  { label: "Escalation SLA", value: "4 min" },
];

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Operations</div>
        <h2 className="mt-2 text-2xl font-semibold text-[#111827]">System performance overview</h2>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {operations.map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#667085]">{item.label}</div>
            <div className="mt-3 text-2xl font-semibold text-[#111827]">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Runbook</div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "Monitor message spikes and fallback queue",
            "Auto-approve low-risk customer actions",
            "Escalate high-risk refunds to manager",
          ].map((step) => (
            <div key={step} className="rounded-[1.2rem] border border-[#efe8df] bg-[#faf8f4] p-3 text-sm text-[#374151]">
              {step}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
