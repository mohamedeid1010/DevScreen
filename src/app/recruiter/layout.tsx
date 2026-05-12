import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  LayoutDashboard,
  Target,
  UsersRound,
  WandSparkles,
} from "lucide-react";

const navItems = [
  { href: "/recruiter", label: "Overview", icon: LayoutDashboard },
  { href: "/recruiter/jobs/new", label: "New role", icon: WandSparkles },
  { href: "/recruiter/jobs/frontend-platform/matches", label: "Matches", icon: UsersRound },
];

type RecruiterLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_46%,#111827_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-slate-950/55 p-6 backdrop-blur lg:w-80 lg:border-b-0 lg:border-r lg:p-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-slate-950">
              <BriefcaseBusiness className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                Recruiter
              </p>
              <p className="text-lg font-semibold">Devscreen Console</p>
            </div>
          </Link>

          <div className="mt-8 rounded-[1.75rem] border border-cyan-300/15 bg-cyan-300/8 p-5">
            <p className="text-sm text-cyan-100/70">Role velocity</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-100">+28%</p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Matching confidence is rising because scorecards and interview criteria are now captured in one flow.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white/78 transition hover:border-white/18 hover:bg-white/10 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="size-4 text-white/45" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Target className="size-4 text-amber-300" />
              Focus signal
            </div>
            <p className="mt-4 text-xl font-semibold">Frontend Platform Engineer</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Top applicants are clustering around design systems, runtime performance, and mentoring depth.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/45 px-6 py-5 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-white/55">Recruiter dashboard</p>
                <h1 className="text-2xl font-semibold tracking-tight">Shared layout for hiring workflows</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70">
                  12 open roles
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
                  Matching engine healthy
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}