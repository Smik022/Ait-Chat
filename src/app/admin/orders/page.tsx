"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Check, Download, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatBDT,
  orderStatusMeta,
  orders,
  paymentStateMeta,
  products,
  type Order,
  type OrderStatus,
} from "@/lib/data";
import {
  AgentBadge,
  ChannelBadge,
  Chip,
  Metric,
  MetricRow,
  Mono,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";

const FILTERS = ["All", "In flight", "Delivered", "Returns"] as const;
type Filter = (typeof FILTERS)[number];

const IN_FLIGHT: OrderStatus[] = ["confirmed", "processing", "shipped"];

function matches(o: Order, f: Filter) {
  if (f === "All") return true;
  if (f === "In flight") return IN_FLIGHT.includes(o.status);
  if (f === "Delivered") return o.status === "delivered";
  return o.status === "return-requested" || o.status === "returned";
}

function OrderDetail({ order }: { order: Order }) {
  const product = products.find((p) => p.id === order.sku);

  return (
    <Panel>
      <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Mono className="text-sm font-medium">{order.id}</Mono>
            <Chip tone={orderStatusMeta[order.status].tone}>
              {orderStatusMeta[order.status].label}
            </Chip>
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {order.customer} · placed {order.placed}
          </p>
        </div>
        <span className="shrink-0 font-mono text-lg font-semibold tabular-nums">
          {formatBDT(order.amount)}
        </span>
      </div>

      <div className="grid gap-0 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <dl className="space-y-2 p-4 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Item</dt>
            <dd className="text-right">
              {order.product}
              <span className="text-muted-foreground"> × {order.qty}</span>
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">SKU</dt>
            <dd>
              <Mono className="text-[11px]">{order.sku}</Mono>
            </dd>
          </div>
          {product ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Stock now</dt>
              <dd className="font-mono tabular-nums">{product.stock}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Started in</dt>
            <dd>
              <ChannelBadge channel={order.channel} />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Closed by</dt>
            <dd>
              <AgentBadge agent={order.agent} />
            </dd>
          </div>
        </dl>

        <dl className="space-y-2 p-4 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Payment</dt>
            <dd className="flex items-center gap-1.5">
              {order.payment}
              <Chip tone={paymentStateMeta[order.paymentState].tone}>
                {paymentStateMeta[order.paymentState].label}
              </Chip>
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Courier</dt>
            <dd>{order.courier}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Tracking</dt>
            <dd>
              <Mono className="text-[11px]">{order.tracking}</Mono>
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Zone</dt>
            <dd>{order.zone}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Expected</dt>
            <dd>{order.eta}</dd>
          </div>
        </dl>
      </div>

      <div className="border-t px-4 py-3">
        <h3 className="text-[12px] font-medium">Timeline</h3>
        <ol className="mt-2.5 space-y-0">
          {order.timeline.map((e, i) => {
            const last = i === order.timeline.length - 1;
            return (
              <li key={e.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full",
                      e.done ? "bg-live text-background" : "border bg-card"
                    )}
                  >
                    {e.done ? <Check className="size-2" strokeWidth={4} /> : null}
                  </span>
                  {!last ? (
                    <span
                      className={cn(
                        "my-0.5 w-px flex-1",
                        e.done ? "bg-live/40" : "bg-border"
                      )}
                    />
                  ) : null}
                </div>
                <div className={cn("min-w-0 flex-1", last ? "pb-0" : "pb-3")}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={cn(
                        "text-[12px]",
                        e.done ? "font-medium" : "text-muted-foreground"
                      )}
                    >
                      {e.label}
                    </span>
                    {e.by ? (
                      <Chip className="h-4">
                        {e.by === "agent" ? "agent" : e.by === "human" ? "person" : e.by}
                      </Chip>
                    ) : null}
                  </div>
                  <span className="block font-mono text-[10px] text-muted-foreground tabular-nums">
                    {e.at}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {order.conversationId ? (
        <div className="border-t px-4 py-3">
          <Link
            href={`/admin/inbox?thread=${order.conversationId}`}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium underline-offset-4 hover:underline"
          >
            Open the conversation that produced this
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      ) : null}
    </Panel>
  );
}

function OrdersInner() {
  const params = useSearchParams();
  const requested = params.get("order");
  const [filter, setFilter] = React.useState<Filter>("All");
  const [selected, setSelected] = React.useState(
    requested && orders.some((o) => o.id === requested) ? requested : orders[0].id
  );

  // Follow an ?order= change during client navigation without an effect round-trip.
  const [seenParam, setSeenParam] = React.useState(requested);
  if (requested !== seenParam) {
    setSeenParam(requested);
    if (requested && orders.some((o) => o.id === requested)) setSelected(requested);
  }

  const shown = orders.filter((o) => matches(o, filter));
  const order = orders.find((o) => o.id === selected)!;

  const revenue = orders
    .filter((o) => o.paymentState === "paid")
    .reduce((n, o) => n + o.amount, 0);
  const cod = orders.filter((o) => o.payment === "Cash on delivery").length;
  const rto = orders.filter((o) => o.paymentState === "uncollected").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        description="Every order here began as a message. Status and tracking are read from the store and the courier at the moment you look, never from a cache."
        actions={
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Download className="size-3.5" />
            Export CSV
          </button>
        }
      />

      <MetricRow>
        <Metric
          label="Captured revenue"
          value={formatBDT(revenue)}
          basis={`${orders.filter((o) => o.paymentState === "paid").length} paid orders`}
        />
        <Metric
          label="In flight"
          value={orders.filter((o) => IN_FLIGHT.includes(o.status)).length}
          basis="confirmed through shipped"
        />
        <Metric
          label="Cash on delivery"
          value={`${Math.round((cod / orders.length) * 100)}%`}
          basis={`${cod} of ${orders.length} orders`}
        />
        <Metric
          label="Refused at the door"
          value={`${Math.round((rto / orders.length) * 100)}%`}
          trend={{ direction: "down", amount: "2.1pt" }}
          basis="৳195 lost per failed delivery"
        />
      </MetricRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <Panel className="min-w-0">
          <div className="flex items-center gap-1 border-b p-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {f}
                <span
                  className={cn(
                    "font-mono tabular-nums",
                    filter === f ? "text-background/60" : "text-muted-foreground/70"
                  )}
                >
                  {orders.filter((o) => matches(o, f)).length}
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            {/* role="grid" because the rows are selectable, and aria-selected is not
                permitted on a plain table row. */}
            <table role="grid" className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b text-[11px] text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Order</th>
                  <th className="px-2 py-2 font-medium">Customer</th>
                  <th className="hidden px-2 py-2 font-medium md:table-cell">Item</th>
                  <th className="px-2 py-2 font-medium">Channel</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(o.id);
                      }
                    }}
                    aria-selected={o.id === selected}
                    className={cn(
                      "cursor-pointer border-b transition-colors last:border-0",
                      o.id === selected ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <Mono className="text-[12px] font-medium">{o.id}</Mono>
                      <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                        {o.placed}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="block truncate">{o.customer}</span>
                      <span className="block font-mono text-[10px] text-muted-foreground">
                        {o.zone}
                      </span>
                    </td>
                    <td className="hidden max-w-[14rem] truncate px-2 py-2.5 text-muted-foreground md:table-cell">
                      {o.product}
                    </td>
                    <td className="px-2 py-2.5">
                      <ChannelBadge channel={o.channel} withLabel={false} />
                    </td>
                    <td className="px-2 py-2.5">
                      <Chip tone={orderStatusMeta[o.status].tone}>
                        {orderStatusMeta[o.status].label}
                      </Chip>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="block font-mono font-medium tabular-nums">
                        {formatBDT(o.amount)}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {o.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-5">
          <OrderDetail order={order} />

          <Panel>
            <PanelHeader
              title="Courier health"
              description="Read live. A slow courier trips the latency rule."
            />
            <ul className="divide-y">
              {[
                { name: "Pathao", zone: "Dhaka Metro", ms: 410, ok: true },
                { name: "Steadfast", zone: "Outside Dhaka", ms: 3210, ok: false },
                { name: "RedX", zone: "Outside Dhaka", ms: 780, ok: true },
              ].map((c) => (
                <li key={c.name} className="flex items-center gap-3 px-4 py-2.5">
                  <Truck className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium">{c.name}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {c.zone}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "font-mono text-[11px] tabular-nums",
                        c.ok ? "text-muted-foreground" : "text-pend-ink"
                      )}
                    >
                      {c.ms}ms
                    </span>
                    <StatusDot className={c.ok ? "bg-live" : "bg-pend"} />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse rounded-lg border bg-card" />}
    >
      <OrdersInner />
    </Suspense>
  );
}
