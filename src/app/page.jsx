import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  GitBranch,
  Radar,
  Sparkles,
  UserRoundSearch,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "87.3%", label: "Avg semantic match confidence", color: "#f99c00" },
  { value: "23×", label: "Repos analyzed per candidate", color: "#00bb7f" },
  { value: "38 min", label: "AI interview kit generated in", color: "#3080ff" },
  { value: "0 CVs", label: "Required to rank top talent", color: "#ac4bff" },
];

const features = [
  "NLP skill extraction from commit history, not self-reported data",
  "Vector similarity matching — cosine distance, not keyword overlap",
  "Bias-resistant scoring with fully auditable signal weighting",
  "Interview questions auto-anchored to the candidate's own code",
];

const tracks = [
  {
    label: "Recruiter",
    title: "Command Center",
    desc: "Post roles, set scoring weights, and get AI-ranked candidates with precise semantic match scores — not gut feel.",
    href: "/recruiter",
    icon: BriefcaseBusiness,
    border: "border-[#f99c001a]",
    bg: "bg-[#f99c000d]",
    badge: "text-[#f99c00] bg-[#f99c000d] border-[#f99c0033]",
  },
  {
    label: "Candidate",
    title: "Signal Portal",
    desc: "Connect GitHub once. Get a code intelligence vector, skill radar, and AI interview kit tailored to real job briefs.",
    href: "/candidate",
    icon: UserRoundSearch,
    border: "border-[#ac4bff1a]",
    bg: "bg-[#ac4bff0d]",
    badge: "text-[#ac4bff] bg-[#ac4bff0d] border-[#ac4bff33]",
  },
];

const pipeline = [
  { step: "01", label: "GitHub OAuth" },
  { step: "02", label: "AST parsing" },
  { step: "03", label: "Skill embeddings" },
  { step: "04", label: "Semantic match" },
  { step: "05", label: "Interview gen." },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-[#f2eae3]">
      {/* Background glows */}
      <div className="animate-drift pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#f99c00]/5 blur-3xl" />
      <div className="animate-drift pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#ac4bff]/5 blur-3xl [animation-delay:1400ms]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,156,0,0.04),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-6 sm:px-10 lg:px-12">

        {/* Nav */}
        <header className="flex items-center justify-between rounded-2xl border border-[#ffffff12] bg-[#111113] px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#f2eae3] p-2 text-[#09090b]">
              <Radar className="size-4" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a8a29e]">
                Devscreen AI
              </p>
              <p className="text-sm font-medium text-[#f2eae3]">
                Code Intelligence Platform
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "/recruiter", label: "Recruiter" },
              { href: "/candidate", label: "Candidate" },
              { href: "/login", label: "Sign in" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-transparent px-4 py-2 text-sm text-[#a8a29e] transition hover:border-[#ffffff12] hover:bg-[#17171a] hover:text-[#f2eae3]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col justify-center py-14 lg:py-16">
          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            <div className="space-y-8">
              <div className="animate-rise space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f99c0033] bg-[#f99c000d] px-4 py-2 font-mono text-xs text-[#f99c00]">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#f99c00]" />
                  Semantic Similarity Engine — Active
                </div>
              </div>

              <div className="animate-rise space-y-5 [animation-delay:60ms]">
                <h1 className="max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                  Replace CVs with{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(to right, #f99c00, #ffd236)" }}
                  >
                    code intelligence.
                  </span>
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#a8a29e]">
                  DevScreen analyzes GitHub repositories with NLP, builds skill
                  embeddings, and matches candidates to roles using vector
                  similarity — no self-reported data, no keyword bingo.
                </p>
              </div>

              <div className="animate-rise flex flex-col gap-3 sm:flex-row [animation-delay:120ms]">
                <Button asChild size="lg" className="h-12 rounded-xl px-6 shadow-[0_0_30px_rgba(249,156,0,0.15)]">
                  <Link href="/recruiter">
                    Open recruiter console
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-[#ffffff12] bg-[#111113] px-6 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
                >
                  <Link href="/candidate">View candidate portal</Link>
                </Button>
              </div>

              {/* Feature list */}
              <ul className="animate-rise space-y-2.5 [animation-delay:180ms]">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#a8a29e]">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#00bb7f]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right panel */}
            <div className="animate-rise space-y-4 [animation-delay:100ms]">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-[#ffffff0a] bg-[#111113] p-5"
                  >
                    <p className="font-mono text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="mt-2 text-xs leading-5 text-[#a8a29e]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Pipeline */}
              <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit className="size-4 text-[#f99c00]" />
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a8a29e]">
                    Analysis Pipeline
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {pipeline.map((p, i) => (
                    <div key={p.step} className="flex flex-1 items-center gap-1">
                      <div className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] px-2 py-2.5 text-center">
                        <span className="font-mono text-[10px] text-[#a8a29e]/40">{p.step}</span>
                        <span className="font-mono text-[10px] font-medium leading-3 text-[#a8a29e]">{p.label}</span>
                      </div>
                      {i < pipeline.length - 1 && (
                        <div className="h-px w-2 shrink-0 bg-[#ffffff12]" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1 rounded-full bg-[#ffffff0a]">
                  <div
                    className="animate-grow-x h-full w-full rounded-full"
                    style={{ background: "linear-gradient(to right, #f99c00, #00bb7f, #ac4bff)" }}
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] text-[#a8a29e]/50">
                  ada-002 · 1,536-dim vectors · cosine distance threshold 0.72
                </p>
              </div>

              {/* GitHub badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#00bb7f1a] bg-[#00bb7f0d] px-4 py-3">
                <GitBranch className="size-4 shrink-0 text-[#00bb7f]" />
                <p className="text-sm text-[#a8a29e]">
                  Connect GitHub once — every repo, commit, and PR becomes a signal input.
                </p>
              </div>
            </div>
          </section>

          {/* Two tracks */}
          <section className="mt-14 grid gap-4 lg:grid-cols-2">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <Link
                  key={track.href}
                  href={track.href}
                  className={`group animate-rise rounded-2xl border p-6 transition hover:brightness-110 ${track.border} ${track.bg}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs ${track.badge}`}>
                        <Icon className="size-3" />
                        {track.label}
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-[#f2eae3]">{track.title}</h3>
                      <p className="mt-3 max-w-sm text-sm leading-7 text-[#a8a29e]">
                        {track.desc}
                      </p>
                    </div>
                    <Zap className="size-5 shrink-0 text-[#ffffff20] transition group-hover:text-[#ffffff40]" />
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#a8a29e] transition group-hover:text-[#f2eae3]">
                    Enter portal
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
