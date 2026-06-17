"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  AlertOctagon,
  BarChart3,
  Bell,
  Bot,
  CheckCircle,
  Gauge,
  Home,
  Layers3,
  LockKeyhole,
  Map,
  Menu,
  Orbit,
  Settings,
  SlidersHorizontal,
  Workflow,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Mission Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/map", label: "Digital Twin Map", icon: Map },
  { href: "/risk-center", label: "Risk Center", icon: Activity },
  { href: "/simulator", label: "Scenario Simulator", icon: SlidersHorizontal },
  { href: "/analytics", label: "National Analytics", icon: BarChart3 },
  { href: "/architecture", label: "AI Architecture", icon: Workflow },
  { href: "/validation", label: "Model Validation", icon: CheckCircle },
  { href: "/alerts", label: "Emergency Alerts", icon: AlertOctagon },
  { href: "/history", label: "Explorer", icon: Layers3 },
  { href: "/copilot", label: "AI Copilot", icon: Bot },
  { href: "/admin", label: "Admin", icon: Settings },
  { href: "/login", label: "Sign In", icon: LockKeyhole },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLanding) return <>{children}</>;

  return (
    <div className="min-h-screen bg-radar-grid bg-[size:44px_44px]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-cyan-300/15 bg-slate-950/82 px-4 py-5 backdrop-blur-2xl lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="grid h-11 w-11 place-items-center rounded-md border border-cyan-300/30 bg-cyan-400/10">
            <Orbit className="h-6 w-6 text-cyan-200" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Bharat
            </span>
            <span className="block text-lg font-semibold tracking-normal text-white">
              Climate Twin
            </span>
          </span>
        </Link>

        <nav className="mt-8 grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition",
                  active && "bg-cyan-400/12 text-white shadow-glow",
                  !active && "hover:bg-white/6 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-cyan-300/15 bg-slate-950/84 px-4 py-3 backdrop-blur-2xl lg:ml-72">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/20 bg-white/5 text-cyan-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Orbit className="h-5 w-5 text-cyan-200" />
              <span className="font-semibold text-white">Bharat Climate Twin</span>
            </Link>
          </div>
          <div className="hidden text-sm text-muted-foreground lg:block">
            National Climate Digital Twin Command Layer
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-md border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-100 sm:block">
              Live mock feeds synced
            </div>
            <Link
              href="/alerts"
              className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/20 bg-white/5 text-cyan-100 hover:bg-white/10 transition"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 h-full w-72 border-r border-cyan-300/15 bg-slate-950 px-4 py-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/30 bg-cyan-400/10">
                  <Orbit className="h-5 w-5 text-cyan-200" />
                </span>
                <span className="font-semibold text-white">Bharat Climate Twin</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-6 grid gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition",
                      active && "bg-cyan-400/12 text-white shadow-glow",
                      !active && "hover:bg-white/6 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="px-4 py-5 lg:ml-72 lg:px-8">{children}</main>
    </div>
  );
}
