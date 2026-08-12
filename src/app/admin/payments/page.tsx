const transactions = [
  { method: "bKash", amount: "৳2,580", status: "captured" },
  { method: "Nagad", amount: "৳3,890", status: "pending" },
  { method: "Card", amount: "৳1,980", status: "settled" },
  { method: "Cash on delivery", amount: "৳2,450", status: "scheduled" },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Payments</div>
            <h2 className="mt-1 text-2xl font-semibold text-[#111827]">Transaction controls</h2>
          </div>
          <button type="button" className="rounded-full bg-[#0e5a43] px-4 py-2 text-sm font-semibold text-white">
            Reconcile ledger
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {transactions.map((item) => (
          <div key={item.method} className="rounded-[1.5rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#667085]">{item.method}</div>
            <div className="mt-3 text-2xl font-semibold text-[#111827]">{item.amount}</div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">{item.status}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
