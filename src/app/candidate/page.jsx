import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Code2,
  GitBranch,
  GitCommit,
  GitFork,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillRadar } from "@/components/ui/skill-radar";

const languages = [
  { name: "TypeScript", pct: 64.2, color: "#3080ff" },
  { name: "JavaScript", pct: 18.7, color: "#f99c00" },
  { name: "Python", pct: 9.4, color: "#00bb7f" },
  { name: "CSS / SCSS", pct: 7.7, color: "#ac4bff" },
];

const metrics = [
  { label: "Repos analyzed", value: "23", icon: GitBranch, color: "#f99c00" },
  { label: "Files processed", value: "1,847", icon: Code2, color: "#00bb7f" },
  { label: "Commits (90d)", value: "312", icon: GitCommit, color: "#3080ff" },
  { label: "Avg complexity", value: "8.3", icon: Brain, color: "#ac4bff" },
];

const radarData = [
  { skill: "Code Modularity", value: 88 },
  { skill: "Security Awareness", value: 74 },
  { skill: "Test Coverage", value: 82 },
  { skill: "API Design", value: 86 },
  { skill: "Performance Opt.", value: 91 },
  { skill: "Documentation", value: 73 },
];

const topRepos = [
  {
    name: "react-perf-toolkit",
    stars: 847,
    desc: "Runtime performance instrumentation and render budget utilities for React 19.",
    complexity: 9.1,
    testCoverage: 87,
    commits: 143,
  },
  {
    name: "devscreen-auth",
    stars: 412,
    desc: "JWT-based auth middleware with refresh token rotation and audit logging.",
    complexity: 7.4,
    testCoverage: 94,
    commits: 89,
  },
  {
    name: "css-variables-system",
    stars: 291,
    desc: "Design token pipeline from Figma variables to CSS custom properties.",
    complexity: 5.8,
    testCoverage: 71,
    commits: 67,
  },
];

const commitGrid = [
  [3, 5, 2, 0, 4, 6, 1],
  [0, 2, 5, 4, 3, 5, 2],
  [4, 6, 3, 2, 5, 4, 0],
  [1, 3, 4, 5, 2, 6, 4],
  [2, 4, 0, 3, 5, 3, 2],
  [5, 3, 4, 2, 4, 5, 6],
  [3, 1, 5, 4, 3, 2, 4],
  [4, 5, 2, 3, 0, 4, 5],
  [2, 3, 4, 5, 4, 3, 6],
  [0, 2, 3, 4, 5, 2, 3],
  [4, 5, 6, 3, 2, 4, 5],
  [3, 4, 2, 5, 4, 3, 2],
  [5, 3, 4, 2, 4, 5, 6],
];

function commitCell(val) {
  if (val === 0) return "bg-[#ffffff0a]";
  if (val <= 2) return "bg-[#ac4bff33]";
  if (val <= 4) return "bg-[#ac4bff66]";
  return "bg-[#ac4bff]";
}

export const metadata = { title: "Code Intelligence Vector" };

export default function CandidateProfilePage() {
  return (
    <div className="space-y-4">

      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffffff12] bg-[#ffffff0a] px-3 py-1 font-mono text-xs text-[#a8a29e]">
                <GitFork className="size-3" />
                GitHub OAuth — Synced
              </span>
              <span className="rounded-full border border-[#ffffff0a] bg-[#ffffff07] px-3 py-1 font-mono text-xs text-[#a8a29e]/70">
                NLP extraction · Bias-resistant v2.4
              </span>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                Code Intelligence Vector
              </p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#f2eae3] sm:text-5xl">
                Nora Salem
              </h1>
              <p className="mt-2 font-mono text-sm text-[#a8a29e]">
                github.com/norasalem · Cairo, Egypt · Last sync 4m ago
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="h-10 rounded-xl px-5 text-sm">
                <Link href="/candidate/interviews/frontend-systems">
                  View AI interview plan
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl px-5 text-sm"
              >
                <Link href="/recruiter/jobs/frontend-platform/matches">Recruiter view</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-2">
            {metrics.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-4 text-center"
              >
                <Icon className="mx-auto size-4" style={{ color }} />
                <p className="mt-2 font-mono text-2xl font-bold" style={{ color }}>{value}</p>
                <p className="mt-1 text-[11px] text-[#a8a29e]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">

        {/* Left */}
        <div className="space-y-4">

          {/* Language distribution */}
          <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                  Language Distribution
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">Extracted from source</h2>
              </div>
              <Code2 className="size-4 text-[#a8a29e]" />
            </div>

            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#a8a29e]">{lang.name}</span>
                    <span className="font-mono text-xs font-semibold" style={{ color: lang.color }}>
                      {lang.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#ffffff0a]">
                    <div
                      className="animate-grow-x h-full rounded-full opacity-70"
                      style={{ width: `${lang.pct}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang.name}
                  className="flex items-center gap-1.5 rounded-full border border-[#ffffff0a] bg-[#0c0c0e] px-2.5 py-1 font-mono text-xs text-[#a8a29e]"
                >
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  {lang.name}
                </span>
              ))}
            </div>
          </article>

          {/* Top repositories */}
          <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                  Top Repositories
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">Analyzed signal sources</h2>
              </div>
              <GitBranch className="size-4 text-[#a8a29e]" />
            </div>

            <div className="space-y-3">
              {topRepos.map((repo, i) => (
                <div
                  key={repo.name}
                  className="animate-rise rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-4"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#f99c00]" />
                        <p className="font-mono text-sm font-semibold text-[#f2eae3]">{repo.name}</p>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[#a8a29e]">{repo.desc}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[#ffffff0a] bg-[#111113] px-2 py-0.5 font-mono text-[10px] text-[#a8a29e]">
                      ★ {repo.stars}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-[#ffffff0a] bg-[#111113] p-2 text-center">
                      <p className="font-mono text-xs font-semibold text-[#ac4bff]">{repo.complexity}</p>
                      <p className="text-[10px] text-[#a8a29e]">complexity</p>
                    </div>
                    <div className="rounded-lg border border-[#ffffff0a] bg-[#111113] p-2 text-center">
                      <p className="font-mono text-xs font-semibold text-[#00bb7f]">{repo.testCoverage}%</p>
                      <p className="text-[10px] text-[#a8a29e]">test cov.</p>
                    </div>
                    <div className="rounded-lg border border-[#ffffff0a] bg-[#111113] p-2 text-center">
                      <p className="font-mono text-xs font-semibold text-[#f99c00]">{repo.commits}</p>
                      <p className="text-[10px] text-[#a8a29e]">commits</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Right */}
        <div className="space-y-4">

          {/* Skill radar */}
          <article className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                  Skill Vector Radar
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">NLP-extracted competencies</h2>
              </div>
              <Zap className="size-4 text-[#ac4bff]" />
            </div>
            <SkillRadar data={radarData} accentColor="#ac4bff" />
            <div className="mt-2 flex items-center gap-2">
              <Sparkles className="size-3 text-[#a8a29e]/40" />
              <p className="font-mono text-[10px] text-[#a8a29e]/50">
                Axes derived from commit patterns · NLP semantic clustering
              </p>
            </div>
          </article>

          {/* Commit heatmap */}
          <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                  Commit Pattern
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">90-day activity heatmap</h2>
              </div>
              <TrendingUp className="size-4 text-[#00bb7f]" />
            </div>

            <div className="flex gap-1">
              {commitGrid.map((week, wi) => (
                <div key={wi} className="flex flex-1 flex-col gap-1">
                  {week.map((val, di) => (
                    <div
                      key={di}
                      className={`h-3 rounded-sm ${commitCell(val)}`}
                      title={`${val} commits`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="font-mono text-[10px] text-[#a8a29e]/40">
                312 commits · avg 4.2/day · churn 23%
              </p>
              <div className="flex items-center gap-1">
                <p className="font-mono text-[10px] text-[#a8a29e]/40">less</p>
                {[0, 2, 3, 5, 6].map((v, i) => (
                  <div key={i} className={`size-2.5 rounded-sm ${commitCell(v)}`} />
                ))}
                <p className="font-mono text-[10px] text-[#a8a29e]/40">more</p>
              </div>
            </div>
          </article>

          {/* Readiness */}
          <article className="rounded-2xl border border-[#00bb7f1a] bg-[#00bb7f0d] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="size-4 text-[#00bb7f]" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#00bb7f]/70">
                Interview Readiness
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                { label: "Role fit", value: "88%", sub: "Strong frontend platform alignment" },
                { label: "Signal coverage", value: "6/6", sub: "All target areas have portfolio proof" },
                { label: "Urgency", value: "High", sub: "Architecture scenarios recommended" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#ffffff0a] bg-[#111113] p-4"
                >
                  <p className="font-mono text-[10px] text-[#a8a29e]">{item.label}</p>
                  <p className="mt-1.5 font-mono text-xl font-bold text-[#00bb7f]">{item.value}</p>
                  <p className="mt-1 text-[11px] leading-4 text-[#a8a29e]">{item.sub}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
