import { Link } from "@tanstack/react-router";
import { Menu, Mail, ListChecks, Sparkle, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import avatar from "@/assets/avatar.jpg";

const navItems = [
  { to: "/", label: "Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Summarizer", icon: ListChecks },
  { to: "/chat", label: "AI Chatbot", icon: Sparkle },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-ink/60 transition hover:bg-white/70 data-[status=active]:bg-gradient-to-r data-[status=active]:from-brand data-[status=active]:to-brand-soft data-[status=active]:text-white data-[status=active]:shadow-lg data-[status=active]:shadow-brand/30"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/70 text-ink/70 [a[data-status=active]_&]:bg-white/25 [a[data-status=active]_&]:text-white">
            <Icon className="size-4" strokeWidth={2} />
          </span>
          <span className="text-sm font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#eaf0ff] via-[#eef7f5] to-[#f4eefc] font-sans text-ink">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-brand/25 blur-[90px]" />
        <div className="absolute right-[-120px] top-1/3 h-[380px] w-[380px] rounded-full bg-mint/40 blur-[100px]" />
        <div className="absolute bottom-[-140px] left-1/3 h-[360px] w-[360px] rounded-full bg-[#b39cff]/25 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="grid size-10 place-items-center rounded-xl border border-white/70 bg-white/60 text-ink/70 backdrop-blur-md lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-mint font-display text-lg font-bold text-white shadow-md shadow-brand/30">
              N
            </div>
            <div>
              <p className="font-display text-lg font-semibold leading-none tracking-tight">
                Nexus AI
              </p>
              <p className="text-xs text-ink/50">Workplace Productivity Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 backdrop-blur-md sm:flex">
              <span className="size-2 rounded-full bg-mint" />
              <span className="text-xs font-medium text-ink/60">Session active</span>
            </div>
            <img
              src={avatar}
              alt=""
              loading="lazy"
              width={816}
              height={816}
              className="size-10 rounded-full object-cover outline-1 -outline-offset-1 outline-black/5"
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <aside className="hidden rounded-3xl border border-white/70 bg-white/55 p-5 shadow-xl shadow-ink/5 backdrop-blur-2xl lg:block lg:w-64 lg:shrink-0">
            <p className="px-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
              Workspace
            </p>
            <NavLinks />
            <div className="mt-6 rounded-2xl border border-white/70 bg-white/40 p-4">
              <p className="font-display text-sm font-semibold">Responsible AI</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/55">
                Every output is a draft. Review before you send or share.
              </p>
            </div>
          </aside>

          {mobileOpen && (
            <div className="fixed inset-0 z-30 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
              />
              <div className="absolute left-4 right-4 top-4 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-2xl shadow-ink/10 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                    Workspace
                  </p>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation"
                    className="grid size-8 place-items-center rounded-lg bg-white/70 text-ink/60"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <NavLinks onNavigate={() => setMobileOpen(false)} />
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 rounded-3xl border border-white/70 bg-white/60 p-6 shadow-2xl shadow-ink/5 backdrop-blur-2xl sm:p-8">
            {children}
          </main>
        </div>

        <footer className="flex flex-col items-center gap-1 rounded-2xl border border-white/70 bg-white/40 px-5 py-3 text-center backdrop-blur-md sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-ink/55">
            Responsible AI · Outputs are AI-generated drafts that may contain errors. Always review
            before use.
          </p>
          <p className="text-[11px] text-ink/40">No data stored · session-only demo</p>
        </footer>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-ink/55">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-white/80 bg-white/70 px-3.5 py-2.5 text-sm text-ink placeholder-ink/35 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20";

export const labelClass = "text-xs font-semibold text-ink/70";

export const primaryButtonClass =
  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-soft px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60";
