'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ArrowRight,
  BriefcaseBusiness,
  CreditCard,
  Gauge,
  MessageSquareText,
  Plug,
  Package,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

const navigation = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquareText },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/operations", label: "Operations", icon: BriefcaseBusiness },
  { href: "/admin/integrations", label: "Integration", icon: Plug },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#111827]">
      <div className="min-h-screen">
        <aside className="fixed left-0 top-0 z-40 h-screen w-[286px] shrink-0 overflow-y-auto border-r border-[#e6e1d7] bg-white px-4 py-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <div className="text-lg font-semibold tracking-tight">Menu</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a3]">Workspace</div>
            </div>
          </div>

          <nav className="mt-4 space-y-1.5">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#e9f3ff] text-[#2463eb] shadow-sm"
                      : "text-[#344054] hover:bg-[#f3f6fa] hover:text-[#101828]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 rounded-[1.6rem] bg-[linear-gradient(180deg,#eef5ff,#dbeafe)] p-4 shadow-sm">
            <div className="text-sm font-semibold text-[#102a43]">Unlock More Power!</div>
            <p className="mt-2 text-xs leading-6 text-[#415a77]">
              Upgrade to add more bots, more AI features, and deeper automation.
            </p>
            <button type="button" className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#18a64a] px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Upgrade Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <main className="min-h-screen px-5 py-4 pl-[302px] lg:px-6 lg:py-5 lg:pl-[302px]">
          <header className="sticky top-4 z-30 flex flex-col gap-4 rounded-[1.7rem] border border-[#e6e1d7] bg-white/95 p-4 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2463eb]">Operations overview</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#101828]">AI commerce control room</h1>
              <p className="mt-1 text-sm text-[#667085]">Select a workspace section, then inspect or deploy the underlying automation.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-[#e8e3dc] bg-[#f8fafc] px-3 py-2 text-sm text-[#667085] md:flex">
                <Search className="h-4 w-4" />
                Search conversations
              </div>
              <button type="button" className="rounded-full border border-[#e8e3dc] bg-[#fff] p-2.5 text-[#101828] shadow-sm">
                <Bell className="h-4 w-4" />
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#e8e3dc] bg-[#fff] px-3 py-2 text-sm font-medium text-[#344054] shadow-sm">
                <ShieldCheck className="h-4 w-4 text-[#2463eb]" />
                Safe mode
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17284a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f1e39]"
              >
                Landing page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <div className="mt-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
