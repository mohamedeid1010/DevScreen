import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Github,
  Radar,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tracks = [
  {
    title: "Recruiter Command Center",
    description:
      "Launch roles, tune scoring signals, and review AI-ranked matches from one shared workspace.",
    href: "/recruiter",
    icon: BriefcaseBusiness,
    accent: "from-amber-300 via-orange-300 to-red-300",
  },
  {
    title: "Candidate Growth Portal",
    description:
      "Showcase signal-rich profiles, skill radars, and AI-built interview plans tied to real roles.",
    href: "/candidate",
    icon: UserRoundSearch,
    accent: "from-cyan-300 via-sky-300 to-emerald-300",
  },
];

const milestones = [
  "Route-grouped auth flow that stays out of the public URL.",
  "Recruiter dashboards and job setup tuned for multi-step evaluation.",
  "Candidate views that surface readiness, skills, and interview strategy.",
];

const stats = [
  { value: "18m", label: "Average time to shortlist" },
  { value: "92%", label: "Signal confidence on top matches" },
  { value: "3x", label: "Faster interview prep for candidates" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f8fafc_0%,#fff7ed_38%,#ecfeff_100%)] text-slate-950">
      <div className="animate-drift absolute -left-24 top-24 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="animate-drift absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl [animation-delay:1200ms]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_52%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Devscreen AI
            </p>
            <p className="text-sm text-slate-600">Recruiting surfaces built around signal, not noise.</p>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-950" href="/recruiter">
              Recruiter
            </Link>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-950" href="/candidate">
              Candidate
            </Link>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-950" href="/login">
              Login
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center py-14 lg:py-20">
          <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                <Sparkles className="size-4 text-amber-500" />
                AI talent operating system
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  Hire with one interface. Prepare with another. Keep both in sync.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  This workspace combines recruiter orchestration, candidate storytelling,
                  and interview generation into one App Router structure that scales with your funnel.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full px-6 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                  <Link href="/recruiter">
                    Open recruiter dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/80 bg-white/70 px-6 backdrop-blur">
                  <Link href="/candidate">View candidate portal</Link>
                </Button>
              </div>

              <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                {milestones.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-900/8 bg-white/70 px-4 py-4 shadow-sm backdrop-blur"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-rise rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_32px_80px_rgba(15,23,42,0.22)] [animation-delay:120ms]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-medium text-white/70">Live system snapshot</p>
                  <h2 className="mt-1 text-2xl font-semibold">Two tracks, one shared source of truth</h2>
                </div>
                <Radar className="size-10 text-cyan-300" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/65">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.75rem] bg-white/6 p-5">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <Github className="size-4" />
                  GitHub OAuth feeds candidate profiles straight into structured interview kits.
                </div>
                <div className="mt-4 space-y-3">
                  {[72, 88, 94].map((score, index) => (
                    <div key={score} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>Signal layer {index + 1}</span>
                        <span>{score}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="animate-grow-x h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300"
                          style={{ width: `${score}%`, animationDelay: `${index * 140}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 grid gap-5 lg:grid-cols-2">
            {tracks.map((track, index) => {
              const Icon = track.icon;

              return (
                <article
                  key={track.title}
                  className="animate-rise rounded-[2rem] border border-slate-900/8 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
                  style={{ animationDelay: `${200 + index * 120}ms` }}
                >
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${track.accent}`}>
                    <Icon className="size-7 text-slate-950" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">{track.title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                    {track.description}
                  </p>
                  <Button asChild variant="ghost" className="mt-6 h-10 rounded-full px-0 text-slate-950 hover:bg-transparent">
                    <Link href={track.href}>
                      Explore route
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}