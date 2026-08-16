"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronsUpDown,
  Sparkles,
  Inbox,
  MessageSquareQuote,
  Package,
  Pause,
  Play,
  Plug,
  Search,
  ShieldCheck,
  Tag,
  Users,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { merchant } from "@/lib/data";
import { LiveProvider, useLive, useMounted } from "@/lib/live";
import { LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatusDot } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CommandMenu } from "@/components/command-menu";

const navigation = [
  {
    group: null,
    items: [
      { href: "/admin", label: "Ask", icon: Sparkles },
      { href: "/admin/inbox", label: "Messages", icon: Inbox },
      { href: "/admin/comments", label: "Comments", icon: MessageSquareQuote },
      { href: "/admin/orders", label: "Orders", icon: Package },
      { href: "/admin/products", label: "Products", icon: Tag },
      { href: "/admin/agents", label: "Your assistant", icon: Users },
      { href: "/admin/guardrails", label: "Your rules", icon: ShieldCheck },
      { href: "/admin/knowledge", label: "Setup", icon: BookOpen },
      { href: "/admin/integrations", label: "Channels", icon: Plug },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname.startsWith(href);
}

function SidebarBody({
  onNavigate,
  collapsed = false,
  onToggle,
}: {
  onNavigate?: () => void;
  /** Icon rail mode. The mobile sheet never collapses. */
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b",
          collapsed ? "justify-center" : "gap-2.5 px-4"
        )}
      >
        <LogoMark className="size-7 rounded-md" />
        {!collapsed ? (
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold tracking-tight">Ait-Chat</div>
            <div className="truncate text-[11px] text-muted-foreground">
              Social Commerce OS
            </div>
          </div>
        ) : null}
        {!collapsed && onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Tuck the sidebar away"
            title="Tuck the sidebar away"
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <PanelLeftClose className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="border-b p-2">
        <button
          type="button"
          title={collapsed ? merchant.name : undefined}
          className={cn(
            "flex w-full items-center rounded-md p-2 transition-colors hover:bg-sidebar-accent",
            collapsed ? "justify-center" : "gap-2.5 text-left"
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded bg-foreground text-[11px] font-semibold text-background">
            AT
          </span>
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[13px] font-medium">
                  {merchant.name}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {merchant.category}
                </span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            </>
          ) : null}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {navigation.map((section, i) => (
          <div key={section.group ?? "root"} className={cn(i > 0 && "mt-4")}>
            {section.group && !collapsed ? (
              <div className="px-2 pb-1.5 text-[11px] font-medium text-muted-foreground">
                {section.group}
              </div>
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "flex items-center rounded-md text-[13px] transition-colors",
                        collapsed
                          ? "justify-center px-2 py-2"
                          : "gap-2.5 px-2 py-1.5",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                      )}
                    >
                      {/* Green is reserved for "allowed / paid / delivered". Using it
                          for navigation state too would make the palette ambiguous. */}
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                      />
                      {collapsed ? (
                        <span className="sr-only">{label}</span>
                      ) : (
                        label
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {collapsed && onToggle ? (
        <div className="border-t p-2">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Open the sidebar out"
            title="Open the sidebar out"
            className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        </div>
      ) : null}

      {!collapsed ? (
        <div className="border-t p-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Demonstration workspace. Every conversation, order and figure here is
            illustrative. No channel or store is actually connected.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function LiveToggle() {
  const { live, setLive, metrics } = useLive();
  const mounted = useMounted();

  return (
    <button
      type="button"
      onClick={() => setLive((v) => !v)}
      aria-pressed={live}
      className="inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
    >
      {live ? (
        <StatusDot className="bg-live" pulse />
      ) : (
        <StatusDot className="bg-muted-foreground" />
      )}
      <span>{live ? "Live" : "Paused"}</span>
      <span className="hidden font-mono tabular-nums text-muted-foreground sm:inline">
        {mounted ? metrics.toolCallsToday.toLocaleString("en-US") : "0"}
      </span>
      {live ? (
        <Pause className="size-3 text-muted-foreground" />
      ) : (
        <Play className="size-3 text-muted-foreground" />
      )}
    </button>
  );
}

function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const [commandOpen, setCommandOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenNav}
        aria-label="Open navigation"
      >
        <PanelLeft className="size-4" />
      </Button>

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border px-2.5 text-left text-[13px] text-muted-foreground transition-colors hover:bg-muted sm:max-w-xs"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="truncate">Search</span>
        <kbd className="ml-auto hidden shrink-0 rounded border bg-muted px-1 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <LiveToggle />
        <ThemeToggle />
        <Link
          href="/"
          className="hidden h-8 items-center rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-muted sm:inline-flex"
        >
          Site
        </Link>
      </div>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-sidebar transition-[width] duration-200 ease-out lg:block",
          collapsed ? "w-14" : "w-[248px]"
        )}
      >
        <SidebarBody
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </aside>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Move between sections of the workspace.
          </SheetDescription>
          <SidebarBody onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[padding] duration-200 ease-out",
          collapsed ? "lg:pl-14" : "lg:pl-[248px]"
        )}
      >
        <Topbar onOpenNav={() => setNavOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LiveProvider>
      <Shell>{children}</Shell>
    </LiveProvider>
  );
}
