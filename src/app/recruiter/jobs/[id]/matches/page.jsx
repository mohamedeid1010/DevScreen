import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillRadar } from "@/components/ui/skill-radar";

const analysisSteps = [
  { label: "Fetching GitHub repositories", detail: "23 repos indexed" },
  { label: "Parsing AST structures", detail: "1,847 files analyzed" },
  { label: "Computing complexity vectors", detail: "McCabe + Halstead metrics" },
  { label: "Building skill embeddings", detail: "ada-002 · 1,536-dim vectors" },
  { label: "Running semantic similarity", detail: "cosine threshold 0.72" },
];

const candidates = [
  {
    id: "nora-salem",
    name: "Nora Salem",
    initials: "NS",
    score: 87.3,
    location: "Cairo · Hybrid",
    stage: "Ready for final loop",
    repoCount: 23,
    topRepo: "react-perf-toolkit",
    matchSummary:
      "Nora's open-source contributions in react-perf-toolkit demonstrate advanced compositional patterns and render optimization that directly align with the role's performance requirements. Her commit history shows a systematic approach to API surface reduction, with 73% of PRs including migration guides and clear upgrade paths.",
    strengths: [
      "React compiler fluency",
      "Design system adoption",
      "Performance budgets",
      "Mentoring depth",
    ],
    risks: ["Expects strong staff-level peers"],
    radarData: [
      { skill: "Code Modularity", value: 91 },
      { skill: "Security Awareness", value: 78 },
      { skill: "Test Coverage", value: 85 },
      { skill: "API Design", value: 89 },
      { skill: "Performance Opt.", value: 94 },
      { skill: "Documentation", value: 76 },
    ],
    signals: [
      { label: "Technical depth", value: 95 },
      { label: "Execution range", value: 88 },
      { label: "Leadership fit", value: 84 },
    ],
  },
  {
    id: "karim-adel",
    name: "Karim Adel",
    initials: "KA",
    score: 79.1,
    location: "Alexandria · Remote",
    stage: "Needs architecture interview",
    repoCount: 17,
    topRepo: "node-observability",
    strengths: ["Large-scale migration", "Observability mindset", "Shipping velocity"],
    risks: ["Less mentoring evidence"],
  },
  {
    id: "mariam-tarek",
    name: "Mariam Tarek",
    initials: "MT",
    score: 74.8,
    location: "Dubai · Hybrid",
    stage: "Great for system-design deep dive",
    repoCount: 12,
    topRepo: "cross-platform-ui",
    strengths: ["Cross-platform strategy", "Testing discipline"],
    risks: ["Prefers smaller product scope"],
  },
  {
    id: "youssef-hassan",
    name: "Youssef Hassan",
    initials: "YH",
    score: 68.2,
    location: "London · Remote",
    stage: "Consider for junior-senior transition",
    repoCount: 9,
    topRepo: "micro-frontend-shell",
    strengths: ["Micro-frontend patterns", "Clear tradeoff articulation"],
    risks: ["Limited design system exposure"],
  },
];

function scoreStyle(score) {
  if (score >= 85) return { text: "text-[#00bb7f]", bg: "bg-[#00bb7f0f]", border: "border-[#00bb7f1a]" };
  if (score >= 75) return { text: "text-[#f99c00]", bg: "bg-[#f99c000d]", border: "border-[#f99c001a]" };
  if (score >= 65) return { text: "text-[#a8a29e]", bg: "bg-[#ffffff0a]", border: "border-[#ffffff12]" };
  return { text: "text-[#ff6568]", bg: "bg-[#ff65680f]", border: "border-[#ff65681a]" };
}

function formatRoleTitle(segment) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `${formatRoleTitle(id)} Matches` };
}

export default async function MatchesPage({ params }) {
  const { id } = await params;
  const roleTitle = formatRoleTitle(id);
  const leader = candidates[0];
  const leaderStyle = scoreStyle(leader.score);

  return (
    <div className="space-y-4">

      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Button
              asChild
              variant="ghost"
              className="h-8 rounded-full px-0 text-[#a8a29e] hover:bg-transparent hover:text-[#f2eae3]"
            >
              <Link href="/recruiter">
                <ArrowLeft className="size-3.5" />
                Back
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f99c001a] bg-[#f99c000d] px-3 py-1 font-mono text-xs text-[#f99c00]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#f99c00]" />
                Semantic Similarity Engine — Active
              </span>
              <span className="rounded-full border border-[#ffffff12] bg-[#ffffff0a] px-3 py-1 font-mono text-xs text-[#a8a29e]">
                Bias-resistant extraction v2.4
              </span>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                Match Results
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#f2eae3] sm:text-4xl">
                {roleTitle}
              </h1>
              <p className="mt-2 font-mono text-sm text-[#a8a29e]">
                {candidates.length} candidates ranked · cosine threshold 0.72 · top score {leader.score}%
              </p>
            </div>
          </div>

          {/* Score ring */}
          <div className="animate-glow shrink-0 rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-5 text-center">
            <div
              className="relative mx-auto grid h-28 w-28 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#f99c00 ${leader.score}%, #ffffff0a 0)`,
              }}
            >
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[#09090b] text-center">
                <div>
                  <p className="font-mono text-xl font-bold text-[#f99c00]">{leader.score}%</p>
                  <p className="font-mono text-[10px] text-[#a8a29e]">top match</p>
                </div>
              </div>
            </div>
            <p className="mt-2 font-mono text-[11px] text-[#a8a29e]">semantic match</p>
          </div>
        </div>
      </section>

      {/* ── Analysis pipeline ──────────────────────────────────── */}
      <section className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-4">
        <div className="mb-3 flex items-center gap-2">
          <BrainCircuit className="size-3.5 text-[#f99c00]" />
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a8a29e]">
            Analysis Pipeline — Complete
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-5">
          {analysisSteps.map((step, i) => (
            <div
              key={step.label}
              className="animate-rise rounded-xl border border-[#ffffff0a] bg-[#111113] p-3"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-1.5 text-[#00bb7f]">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span className="font-mono text-[10px] font-medium leading-4">{step.label}</span>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-[#a8a29e]/60">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">

        {/* Ranked list */}
        <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                Ranked Shortlist
              </p>
              <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">Candidates by match score</h2>
            </div>
            <Zap className="size-4 text-[#f99c00]" />
          </div>

          <div className="space-y-2.5">
            {candidates.map((c, i) => {
              const style = scoreStyle(c.score);
              const isTop = i === 0;
              return (
                <div
                  key={c.id}
                  className={`animate-rise rounded-xl border p-4 ${
                    isTop
                      ? "border-[#f99c001a] bg-[#f99c000d]"
                      : "border-[#ffffff0a] bg-[#0c0c0e] hover:bg-[#111113]"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold ${
                          isTop ? "bg-[#f99c001a] text-[#f99c00]" : "bg-[#ffffff0a] text-[#a8a29e]"
                        }`}
                      >
                        {c.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#f2eae3]">{c.name}</h3>
                          {isTop && (
                            <span className="font-mono text-[10px] text-[#f99c00]">TOP</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-[#a8a29e]">{c.location}</p>
                      </div>
                    </div>
                    <div
                      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-xs font-semibold ${style.text} ${style.bg} ${style.border}`}
                    >
                      {c.score}%
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5">
                    <GitBranch className="size-3 text-[#a8a29e]/40" />
                    <span className="font-mono text-[10px] text-[#a8a29e]/50">
                      {c.repoCount} repos · {c.topRepo}
                    </span>
                  </div>

                  <div className="mt-2.5 h-1 rounded-full bg-[#ffffff0a]">
                    <div
                      className="animate-grow-x h-full rounded-full"
                      style={{
                        width: `${c.score}%`,
                        background: isTop
                          ? "linear-gradient(90deg, #f99c00, #ffd236)"
                          : "rgba(255,255,255,0.18)",
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] text-[#a8a29e]/60">{c.stage}</p>
                </div>
              );
            })}
          </div>
        </article>

        {/* Top candidate detail */}
        <div className="space-y-4">

          {/* Match explanation */}
          <div className="rounded-2xl border border-[#f99c001a] bg-[#111113] p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Sparkles className="size-3.5 text-[#f99c00]" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#f99c00]/70">
                AI Match Explanation
              </p>
              <span className="ml-auto rounded-full border border-[#ffffff12] bg-[#ffffff0a] px-2 py-0.5 font-mono text-[10px] text-[#a8a29e]">
                GPT-4o · 2-pass reasoning
              </span>
            </div>

            <h2 className="text-xl font-semibold text-[#f2eae3]">{leader.name}</h2>
            <div
              className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${leaderStyle.border} ${leaderStyle.bg}`}
            >
              <span className={`font-mono text-xs font-bold ${leaderStyle.text}`}>
                {leader.score}% semantic match
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#a8a29e]">{leader.matchSummary}</p>
          </div>

          {/* Skill radar */}
          <div className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                  Skill Vector Radar
                </p>
                <h3 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">Code Intelligence Axes</h3>
              </div>
              <span className="rounded-full border border-[#f99c001a] bg-[#f99c000d] px-2.5 py-1 font-mono text-[10px] text-[#f99c00]">
                NLP-extracted · 6 axes
              </span>
            </div>

            <SkillRadar data={leader.radarData} accentColor="#f99c00" />

            <div className="mt-3 grid grid-cols-3 gap-2">
              {leader.radarData.map((d) => (
                <div
                  key={d.skill}
                  className="rounded-xl border border-[#ffffff0a] bg-[#111113] px-2.5 py-2 text-center"
                >
                  <p className="font-mono text-xs font-bold text-[#f99c00]">{d.value}%</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-[#a8a29e]">{d.skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signals + strengths / risks */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                Signal Scores
              </p>
              <div className="space-y-3">
                {leader.signals.map((s, i) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs text-[#a8a29e]">
                      <span>{s.label}</span>
                      <span className="font-mono font-semibold text-[#f2eae3]">{s.value}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-[#ffffff0a]">
                      <div
                        className="animate-grow-x h-full rounded-full"
                        style={{
                          width: `${s.value}%`,
                          background: "linear-gradient(90deg, #f99c00, #ffd236)",
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[#00bb7f1a] bg-[#00bb7f0f] p-4">
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-[#00bb7f]/70">
                  Detected Strengths
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {leader.strengths.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[#00bb7f1a] bg-[#00bb7f0d] px-2.5 py-1 text-xs text-[#00bb7f]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#f99c001a] bg-[#f99c000d] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="size-3.5 text-[#f99c00]/70" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#f99c00]/70">
                    Risk Signals
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {leader.risks.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-[#f99c001a] bg-[#f99c000d] px-2.5 py-1 text-xs text-[#f99c00]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
