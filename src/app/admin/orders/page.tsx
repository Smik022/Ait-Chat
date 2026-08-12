const orders = [
  { id: "ORD-9317", customer: "Rafiul Islam", item: "Chaya Cotton Kurti", amount: "৳2,580", status: "Shipped" },
  { id: "ORD-9318", customer: "Tasnim Rahman", item: "Dhakai Jamdani Saree", amount: "৳3,890", status: "Processing" },
  { id: "ORD-9319", customer: "Nusrat Jahan", item: "Leather Sandal", amount: "৳1,980", status: "Delivered" },
  { id: "ORD-9320", customer: "Shakil Ahmed", item: "Casual Cotton Set", amount: "৳2,450", status: "Refund review" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">Orders</div>
            <h2 className="mt-1 text-2xl font-semibold text-[#111827]">Recent transactions</h2>
          </div>
          <button type="button" className="rounded-full bg-[#0e5a43] px-4 py-2 text-sm font-semibold text-white">
            Export csv
          </button>
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-[#e7e2d7] bg-white p-4 shadow-sm">
        <div className="overflow-hidden rounded-[1.2rem] border border-[#efe8df]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f9f8f4] text-[#4b5563]">
              <tr>
                <th className="px-3 py-3 font-medium">Order</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Item</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#f0eae1] bg-white">
                  <td className="px-3 py-3 font-medium text-[#111827]">{order.id}</td>
                  <td className="px-3 py-3">{order.customer}</td>
                  <td className="px-3 py-3">{order.item}</td>
                  <td className="px-3 py-3 font-medium">{order.amount}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[#eaf7f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d5d45]">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
