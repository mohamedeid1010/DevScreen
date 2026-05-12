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

type RecruiterLayoutProps = Readonly<{ children: ReactNode }>;

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f2eae3]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">

        <aside className="border-b border-[#ffffff12] bg-[#0c0c0e] p-6 lg:w-72 lg:border-b-0 lg:border-r lg:p-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="rounded-xl bg-[#f99c00] p-2.5 text-[#09090b]">
              <BriefcaseBusiness className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a8a29e]">
                Recruiter
              </p>
              <p className="text-base font-semibold text-[#f2eae3]">Devscreen Console</p>
            </div>
          </Link>

          <div className="mt-8 rounded-2xl border border-[#f99c001a] bg-[#f99c000d] p-4">
            <p className="font-mono text-xs text-[#a8a29e]">Role velocity</p>
            <p className="mt-1.5 font-mono text-3xl font-bold text-[#f99c00]">+28%</p>
            <p className="mt-2 text-xs leading-5 text-[#a8a29e]">
              Matching confidence rising — scorecards and interview criteria aligned.
            </p>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[#a8a29e] transition hover:border-[#ffffff12] hover:bg-[#17171a] hover:text-[#f2eae3]"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="size-3.5 text-[#a8a29e]/50" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-[#ffffff12] bg-[#111113] p-4">
            <div className="flex items-center gap-2 text-xs text-[#a8a29e]">
              <Target className="size-3.5 text-[#f99c00]" />
              Active focus
            </div>
            <p className="mt-3 text-sm font-medium text-[#f2eae3]">Frontend Platform Engineer</p>
            <p className="mt-1.5 text-xs leading-5 text-[#a8a29e]">
              Top candidates cluster around design systems, runtime performance, and mentoring depth.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-[#ffffff12] bg-[#09090b]/85 px-6 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs text-[#a8a29e]">AI Recruiting Console</p>
                <h1 className="text-lg font-semibold tracking-tight text-[#f2eae3]">
                  Semantic Match Engine
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-[#ffffff12] bg-[#111113] px-3 py-1.5 font-mono text-xs text-[#a8a29e]">
                  12 open roles
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-[#00bb7f1a] bg-[#00bb7f0f] px-3 py-1.5 font-mono text-xs text-[#00bb7f]">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#00bb7f]" />
                  Engine active
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
