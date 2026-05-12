import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Gauge,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type MatchPageProps = {
  params: Promise<{ id: string }>;
};

const matches = [
  {
    name: "Nora Salem",
    fit: 92,
    location: "Cairo · Hybrid",
    stage: "Ready for final loop",
    strengths: ["React compiler fluency", "Mentors design system adoption", "Strong performance narratives"],
    risks: ["Wants strong staff-level peers"],
    signals: [
      { label: "Technical depth", value: 95 },
      { label: "Execution range", value: 88 },
      { label: "Leadership fit", value: 84 },
    ],
  },
  {
    name: "Karim Adel",
    fit: 87,
    location: "Alexandria · Remote",
    stage: "Needs architecture interview",
    strengths: ["Large-scale migration work", "Observability mindset", "Strong shipping velocity"],
    risks: ["Less mentoring evidence"],
    signals: [
      { label: "Technical depth", value: 89 },
      { label: "Execution range", value: 92 },
      { label: "Leadership fit", value: 73 },
    ],
  },
  {
    name: "Mariam Tarek",
    fit: 82,
    location: "Dubai · Hybrid",
    stage: "Great for system-design deep dive",
    strengths: ["Cross-platform component strategy", "Testing discipline", "Clear tradeoff articulation"],
    risks: ["Prefers smaller product scope"],
    signals: [
      { label: "Technical depth", value: 84 },
      { label: "Execution range", value: 79 },
      { label: "Leadership fit", value: 80 },
    ],
  },
];

function formatRoleTitle(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `${formatRoleTitle(id)} Matches`,
  };
}

export default async function MatchesPage({ params }: MatchPageProps) {
  const { id } = await params;
  const roleTitle = formatRoleTitle(id);
  const leader = matches[0];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(34,197,94,0.16),rgba(34,211,238,0.14),rgba(15,23,42,0.8))] p-6 shadow-[0_30px_70px_rgba(2,6,23,0.3)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Button asChild variant="ghost" className="h-9 rounded-full px-0 text-white hover:bg-transparent">
              <Link href="/recruiter">
                <ArrowLeft className="size-4" />
                Back to dashboard
              </Link>
            </Button>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/72">
              <Sparkles className="size-4 text-amber-300" />
              Match results for {roleTitle}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              The engine found a tight cluster of candidates with high platform signal.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/68">
              This route uses the dynamic role segment to present one visual story: score concentration, candidate strengths, and where human review should spend its time.
            </p>
          </div>

          <div className="animate-glow rounded-[1.9rem] border border-white/12 bg-slate-950/45 p-5 shadow-[0_0_50px_rgba(34,211,238,0.12)]">
            <div
              className="relative grid h-44 w-44 place-items-center rounded-full"
              style={{
                background: `conic-gradient(rgb(34 211 238) ${leader.fit}%, rgba(255,255,255,0.08) 0)`,
              }}
            >
              <div className="grid h-32 w-32 place-items-center rounded-full bg-slate-950 text-center">
                <p className="text-sm text-white/55">Top score</p>
                <p className="text-4xl font-semibold">{leader.fit}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/55">Signal board</p>
              <h2 className="mt-1 text-2xl font-semibold">Why {leader.name} is currently leading</h2>
            </div>
            <Gauge className="size-6 text-cyan-200" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {leader.signals.map((signal, index) => (
              <div key={signal.label} className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between text-sm text-white/68">
                  <span>{signal.label}</span>
                  <span>{signal.value}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="animate-grow-x h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300"
                    style={{ width: `${signal.value}%`, animationDelay: `${index * 140}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-amber-300/15 bg-amber-300/8 p-5">
            <div className="flex items-center gap-3 text-sm text-amber-50/80">
              <ShieldAlert className="size-4" />
              Human review focus
            </div>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Validate how comfortably the candidate handles platform influence without direct authority. The fit is high, but peer-level partnership expectations matter.
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/55">Ranked shortlist</p>
              <h2 className="mt-1 text-2xl font-semibold">Animated match cards</h2>
            </div>
            <BrainCircuit className="size-6 text-amber-200" />
          </div>

          <div className="mt-6 space-y-4">
            {matches.map((candidate, index) => (
              <article
                key={candidate.name}
                className="animate-rise rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">{candidate.name}</h3>
                      <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">
                        {candidate.fit}% fit
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      {candidate.location} · {candidate.stage}
                    </p>
                  </div>

                  <Button variant="outline" className="h-10 rounded-full border-white/15 bg-white/8 text-white hover:bg-white/12 hover:text-white">
                    Review profile
                    <ArrowRight className="size-4" />
                  </Button>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <p className="text-sm font-medium text-white/60">Strengths</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.strengths.map((strength) => (
                        <span key={strength} className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-50/90">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/60">Watchouts</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.risks.map((risk) => (
                        <span key={risk} className="rounded-full border border-amber-300/18 bg-amber-300/10 px-3 py-1 text-sm text-amber-50/90">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}