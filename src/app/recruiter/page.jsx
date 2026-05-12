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
  { value: "42", label: "Candidates currently ranked", color: "#f99c00" },
  { value: "7", label: "Roles with active scorecards", color: "#3080ff" },
  { value: "14", label: "Interviews generated today", color: "#00bb7f" },
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
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[#f99c001a] bg-[#f99c000d] p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f99c0033] bg-[#f99c000d] px-4 py-2 text-sm text-[#f99c00]">
            <Sparkles className="size-4" />
            Main dashboard
          </div>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-[#f2eae3]">
            Tighten your brief, then let the match engine surface who is truly ready.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#a8a29e]">
            The recruiter side now has a dedicated shared layout, job authoring route, and animated match-results route for role-specific review.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-xl px-5">
              <Link href="/recruiter/jobs/new">
                Create new role
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl border-[#ffffff12] bg-[#0c0c0e] px-5 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
              <Link href="/recruiter/jobs/frontend-platform/matches">
                Review live matches
                <UsersRound className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {overviewStats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
              <div className="rounded-xl p-3" style={{ backgroundColor: `${stat.color}1a` }}>
                <BrainCircuit className="size-5" style={{ color: stat.color }} />
              </div>
              <p className="mt-4 font-mono text-4xl font-semibold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="mt-2 text-sm text-[#a8a29e]">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a8a29e]">Active searches</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#f2eae3]">Roles with the highest confidence</h2>
            </div>
            <ScanSearch className="size-6 text-[#f99c00]" />
          </div>

          <div className="mt-6 space-y-3">
            {activeRoles.map((role) => (
              <div key={role.title} className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#f2eae3]">{role.title}</h3>
                    <p className="mt-1 text-sm text-[#a8a29e]">{role.candidates} ranked candidates ready for review</p>
                  </div>
                  <div className="rounded-full border border-[#00bb7f1a] bg-[#00bb7f0d] px-3 py-1 text-sm text-[#00bb7f]">
                    {role.confidence}% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#a8a29e]">Pipeline diagnostics</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#f2eae3]">What the ranking model is emphasizing</h2>
            </div>
            <CalendarClock className="size-6 text-[#f99c00]" />
          </div>

          <div className="mt-6 space-y-4">
            {pipelineSignals.map((signal, index) => (
              <div key={signal.label}>
                <div className="flex items-center justify-between text-sm text-[#a8a29e]">
                  <span>{signal.label}</span>
                  <span className="font-mono text-[#f99c00]">{signal.value}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#ffffff0a]">
                  <div
                    className="animate-grow-x h-full rounded-full"
                    style={{
                      width: `${signal.value}%`,
                      animationDelay: `${index * 120}ms`,
                      background: "linear-gradient(to right, #f99c00, #ffd236)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            {activityFeed.map((event) => (
              <div key={event} className="rounded-xl border border-[#ffffff0a] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
                {event}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
