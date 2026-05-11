import Link from "next/link";
import { ArrowUpRight, BrainCircuit, Compass, LayoutPanelTop, Sparkles, UserRound } from "lucide-react";

const navItems = [
  { href: "/candidate", label: "Profile", icon: UserRound },
  { href: "/candidate/interviews/frontend-systems", label: "Interviews", icon: BrainCircuit },
  { href: "/recruiter", label: "Recruiter view", icon: LayoutPanelTop },
];

export default function CandidateLayout({ children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#f8fafc_0%,#f8fafc_28%,#ecfeff_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200/80 bg-white/85 p-6 backdrop-blur lg:w-80 lg:border-b-0 lg:border-r lg:p-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <Compass className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Candidate</p>
              <p className="text-lg font-semibold">Signal Portal</p>
            </div>
          </Link>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(160deg,rgba(34,211,238,0.12),rgba(255,255,255,0.92))] p-5 shadow-sm">
            <p className="text-sm text-slate-500">Readiness snapshot</p>
            <p className="mt-2 text-4xl font-semibold text-slate-950">88%</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your strongest signals come from architecture ownership, mentoring, and a disciplined feedback loop on shipped features.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950/15 hover:text-slate-950"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="size-4 text-slate-400" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <Sparkles className="size-4 text-amber-300" />
              Candidate context
            </div>
            <p className="mt-4 text-lg font-semibold">The interview route reuses the same profile signals.</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              That keeps skill radar themes, growth areas, and generated questions aligned with the role you are targeting.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/72 px-6 py-5 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Candidate portal</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Shared layout for profile and interview prep</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
                  GitHub synced
                </div>
                <div className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm text-cyan-700">
                  2 interviews recommended
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