"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Gauge,
  Inbox,
  MessageSquareQuote,
  Package,
  Plug,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { conversations, orders } from "@/lib/data";

const routes = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/comments", label: "Comments", icon: MessageSquareQuote },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/guardrails", label: "Guardrails", icon: ShieldCheck },
  { href: "/admin/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/integrations", label: "Integrations", icon: Plug },
];

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search conversations, orders and sections…" />
      <CommandList>
        <CommandEmpty>Nothing matched that.</CommandEmpty>

        <CommandGroup heading="Go to">
          {routes.map(({ href, label, icon: Icon }) => (
            <CommandItem key={href} value={label} onSelect={() => go(href)}>
              <Icon />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Conversations">
          {conversations.slice(0, 5).map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.customer} ${c.id} ${c.intent}`}
              onSelect={() => go(`/admin/inbox?thread=${c.id}`)}
            >
              <Inbox />
              <span className="truncate">{c.customer}</span>
              <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
                {c.id}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Orders">
          {orders.slice(0, 5).map((o) => (
            <CommandItem
              key={o.id}
              value={`${o.id} ${o.customer} ${o.product}`}
              onSelect={() => go(`/admin/orders?order=${o.id}`)}
            >
              <Package />
              <span className="truncate">{o.customer}</span>
              <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
                {o.id}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
