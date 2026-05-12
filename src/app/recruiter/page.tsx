import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  ScanSearch,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const overviewStats = [
  { value: "42", label: "Candidates currently ranked", tone: "from-amber-300 to-orange-300" },
  { value: "7", label: "Roles with active scorecards", tone: "from-cyan-300 to-sky-300" },
  { value: "14", label: "Interviews generated today", tone: "from-emerald-300 to-lime-300" },
];

const activeRoles = [
  { title: "Frontend Platform Engineer", candidates: 18, confidence: 92 },
  { title: "Design Systems Lead", candidates: 11, confidence: 87 },
  { title: "AI Product Recruiter", candidates: 13, confidence: 84 },
];

const pipelineSignals = [
  { label: "Portfolio depth", value: 94 },
  { label: "System design", value: 88 },
  { label: "Leadership fit", value: 81 },
  { label: "Interview readiness", value: 90 },
];

const activityFeed = [
  "Three new profiles crossed the 85% fit threshold in the last hour.",
  "Interview prompts were refreshed after scorecard weights changed.",
  "Candidate portal signals synced from GitHub callback events.",
];

export const metadata = {
  title: "Recruiter Dashboard",
};

export default function RecruiterDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.14),rgba(56,189,248,0.12),rgba(15,23,42,0.85))] p-6 shadow-[0_28px_70px_rgba(2,6,23,0.28)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/75">
            <Sparkles className="size-4 text-amber-300" />
            Main dashboard
          </div>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight">
            Tighten your brief, then let the match engine surface who is truly ready.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            The recruiter side now has a dedicated shared layout, job authoring route, and animated match-results route for role-specific review.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-full px-5 text-slate-950" variant="secondary">
              <Link href="/recruiter/jobs/new">
                Create new role
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="h-11 rounded-full border-white/15 bg-white/8 px-5 text-white hover:bg-white/12 hover:text-white" variant="outline">
              <Link href="/recruiter/jobs/frontend-platform/matches">
                Review live matches
                <UsersRound className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {overviewStats.map((stat) => (
            <article key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5">
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${stat.tone} p-3 text-slate-950`}>
                <BrainCircuit className="size-5" />
              </div>
              <p className="mt-4 text-4xl font-semibold">{stat.value}</p>
              <p className="mt-2 text-sm text-white/65">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/55">Active searches</p>
              <h2 className="mt-1 text-2xl font-semibold">Roles with the highest confidence</h2>
            </div>
            <ScanSearch className="size-6 text-cyan-200" />
          </div>

          <div className="mt-6 space-y-4">
            {activeRoles.map((role) => (
              <div key={role.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{role.candidates} ranked candidates ready for review</p>
                  </div>
                  <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">
                    {role.confidence}% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/55">Pipeline diagnostics</p>
              <h2 className="mt-1 text-2xl font-semibold">What the ranking model is emphasizing</h2>
            </div>
            <CalendarClock className="size-6 text-amber-200" />
          </div>

          <div className="mt-6 space-y-4">
            {pipelineSignals.map((signal, index) => (
              <div key={signal.label}>
                <div className="flex items-center justify-between text-sm text-white/68">
                  <span>{signal.label}</span>
                  <span>{signal.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="animate-grow-x h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300"
                    style={{ width: `${signal.value}%`, animationDelay: `${index * 120}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3">
            {activityFeed.map((event) => (
              <div key={event} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-sm leading-6 text-white/70">
                {event}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}