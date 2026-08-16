"use client";

import * as React from "react";
import { AlertTriangle, Camera, Check, Plus, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  addedViaMeta,
  catalogueDraft,
  formatBDT,
  products,
  type Product,
} from "@/lib/data";
import {
  Chip,
  Metric,
  MetricRow,
  Mono,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";

const stockMeta: Record<Product["status"], { label: string; tone: string; dot: string }> = {
  "in-stock": { label: "In stock", tone: "bg-live-soft text-live-ink", dot: "bg-live" },
  "low-stock": { label: "Running low", tone: "bg-pend-soft text-pend-ink", dot: "bg-pend" },
  "out-of-stock": { label: "Sold out", tone: "bg-block-soft text-block-ink", dot: "bg-block" },
  restocking: { label: "Coming back", tone: "bg-route-soft text-route-ink", dot: "bg-route" },
};

/* ------------------------------- Add a product ---------------------------- */

type Phase = "empty" | "reading" | "read";

function AddProduct({ onAdd }: { onAdd: (p: Product) => void }) {
  const [typed, setTyped] = React.useState(catalogueDraft.typed);
  const [phase, setPhase] = React.useState<Phase>("empty");
  const [stock, setStock] = React.useState("");

  React.useEffect(() => {
    if (phase !== "reading") return;
    const id = window.setTimeout(() => setPhase("read"), 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  return (
    <Panel id="add-a-product" className="scroll-mt-20">
      <PanelHeader
        title="Add a product"
        description="Type it however you say it. It will pull out the details and ask about anything it is unsure of."
        action={
          phase !== "empty" ? (
            <button
              type="button"
              onClick={() => {
                setPhase("empty");
                setStock("");
              }}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[11px] font-medium transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-3" />
              Start again
            </button>
          ) : null
        }
      />

      <div className="p-4">
        <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <button
            type="button"
            onClick={() => toast("Photo upload is a placeholder in this demonstration")}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border border-dashed text-muted-foreground transition-colors hover:bg-muted/50"
          >
            <Camera className="size-5" />
            <span className="text-[11px]">Add a photo</span>
          </button>

          <div className="flex flex-col">
            <label htmlFor="typed" className="text-[12px] font-medium">
              What is it?
            </label>
            <textarea
              id="typed"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="nokshi kurti 1450 M L XL cotton 2 colour maroon r navy"
              className="mt-1.5 min-h-[5.5rem] w-full flex-1 resize-none rounded-md border bg-background px-3 py-2.5 text-[13px] leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="button"
              onClick={() => setPhase("reading")}
              disabled={!typed.trim() || phase === "reading"}
              className="mt-2 inline-flex h-9 w-fit items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Sparkles className="size-3.5" />
              {phase === "reading" ? "Reading it" : "Read it"}
            </button>
          </div>
        </div>

        {phase === "read" ? (
          <div className="mt-4 space-y-3" role="status" aria-live="polite">
            <div className="overflow-hidden rounded-md border">
              <div className="border-b bg-muted/40 px-3 py-2">
                <p className="text-[12px] font-medium">Here is what it got</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  All of it came from what you typed. Change anything that is wrong.
                </p>
              </div>
              <ul className="divide-y">
                {catalogueDraft.extracted.map((f) => (
                  <li key={f.field} className="flex items-center gap-3 px-3 py-2">
                    <span className="w-20 shrink-0 text-[11px] text-muted-foreground">
                      {f.field}
                    </span>
                    <span className="flex-1 text-[13px] font-medium">{f.value}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {f.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-md border border-pend/40 bg-pend-soft">
              <div className="flex items-center gap-2 border-b border-pend/25 px-3 py-2">
                <AlertTriangle className="size-3.5 shrink-0 text-pend" />
                <p className="text-[12px] font-medium text-pend-ink">
                  Two things it will not guess
                </p>
              </div>
              <ul className="divide-y divide-pend/20">
                {catalogueDraft.asks.map((a, i) => (
                  <li key={a.question} className="px-3 py-2.5">
                    <p className="text-[12px] font-medium text-pend-ink">{a.question}</p>
                    <p className="mt-0.5 text-[11px] text-pend-ink/85">{a.why}</p>
                    {i === 0 ? (
                      <input
                        type="number"
                        min={0}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="e.g. 12"
                        aria-label="How many do you have"
                        className="mt-1.5 h-8 w-28 rounded-md border bg-background px-2.5 font-mono text-[13px] tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={!stock}
              onClick={() => {
                onAdd({
                  id: `P-${1400 + Math.floor(Number(stock) || 0)}`,
                  name: "Nokshi Kurti",
                  category: "Kurti",
                  price: 1450,
                  stock: Number(stock),
                  sizes: ["M", "L", "XL"],
                  colours: ["Maroon", "Navy"],
                  material: "Cotton",
                  status: Number(stock) > 8 ? "in-stock" : "low-stock",
                  sold: 0,
                  addedVia: "photo",
                  addedOn: "today",
                });
                setPhase("empty");
                setStock("");
                toast.success("Nokshi Kurti added", {
                  description: `${stock} in stock. Your agents can quote it from now on.`,
                });
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Check className="size-3.5" />
              Add to catalogue
            </button>
            {!stock ? (
              <p className="text-[11px] text-muted-foreground">
                It needs a stock count first. Without one it cannot honestly tell anyone
                whether the item is available.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

/* --------------------------------- Listing -------------------------------- */

function Catalogue({ items }: { items: Product[] }) {
  return (
    <Panel>
      <PanelHeader
        title="Your catalogue"
        description="What the agents are allowed to quote. Nothing else exists as far as they are concerned."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b text-[11px] text-muted-foreground">
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="hidden px-2 py-2 font-medium md:table-cell">Sizes</th>
              <th className="px-2 py-2 text-right font-medium">Price</th>
              <th className="px-2 py-2 text-right font-medium">Left</th>
              <th className="px-2 py-2 font-medium">Status</th>
              <th className="hidden px-4 py-2 font-medium lg:table-cell">Added</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const meta = stockMeta[p.status];
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{p.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {p.material} · {p.colours.join(", ")}
                    </div>
                  </td>
                  <td className="hidden px-2 py-2.5 text-[11px] text-muted-foreground md:table-cell">
                    {p.sizes.join(", ")}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <span className="block font-mono font-medium tabular-nums">
                      {formatBDT(p.price)}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-2 py-2.5 text-right font-mono font-medium tabular-nums",
                      p.stock === 0 && "text-block-ink",
                      p.stock > 0 && p.stock <= 8 && "text-pend-ink"
                    )}
                  >
                    {p.stock}
                  </td>
                  <td className="px-2 py-2.5">
                    <Chip tone={meta.tone}>
                      <StatusDot className={meta.dot} />
                      {meta.label}
                    </Chip>
                  </td>
                  <td className="hidden px-4 py-2.5 lg:table-cell">
                    <span className="block text-[11px]">{addedViaMeta[p.addedVia]}</span>
                    <Mono className="text-[10px] text-muted-foreground">{p.addedOn}</Mono>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export default function ProductsPage() {
  const [items, setItems] = React.useState<Product[]>(products);
  const low = items.filter((p) => p.status === "low-stock").length;
  const out = items.filter((p) => p.stock === 0).length;
  const fromReplies = items.filter((p) => p.addedVia === "reply").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        description="Your catalogue lives here, not in a store. Everything the agents quote about an item is something you entered or confirmed."
        actions={
          <a
            href="#add-a-product"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Plus className="size-3.5" />
            Add a product
          </a>
        }
      />

      <MetricRow>
        <Metric label="Items" value={items.length} basis="everything you sell" />
        <Metric
          label="Running low"
          value={low}
          trend={low > 0 ? { direction: "down", amount: `${low}` } : undefined}
          basis="restock before they sell out"
        />
        <Metric label="Sold out" value={out} basis="agents will not quote these" />
        <Metric
          label="Added from your replies"
          value={fromReplies}
          basis="things you told a customer once"
        />
      </MetricRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <Catalogue items={items} />
        <AddProduct onAdd={(p) => setItems((prev) => [p, ...prev])} />
      </div>
    </div>
  );
}
