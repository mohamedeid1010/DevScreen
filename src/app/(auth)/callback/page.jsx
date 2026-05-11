import Link from "next/link";
import { ArrowRight, CheckCircle2, Github, Radar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const callbackSteps = [
  {
    title: "GitHub identity verified",
    detail: "Primary account linked and access scope confirmed.",
  },
  {
    title: "Portfolio signals imported",
    detail: "Repositories, commit activity, and topic tags mapped to profile fields.",
  },
  {
    title: "Interview kit prepared",
    detail: "Question generation now has context from role fit, depth, and project history.",
  },
];

export const metadata = {
  title: "Candidate Callback",
};

export default function CallbackPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_48%,#083344_100%)] px-6 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.42)] backdrop-blur sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Github className="size-4" />
              Candidate OAuth callback
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Authentication finished. Candidate context is ready for the portal.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
              This route simulates the post-GitHub handoff where profile evidence, signal extraction, and interview generation all become available.
            </p>
          </div>

          <div className="animate-glow rounded-[1.75rem] border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-right shadow-[0_0_40px_rgba(16,185,129,0.18)]">
            <p className="text-sm text-emerald-100/70">Readiness status</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-100">Portal synced</p>
            <p className="mt-2 text-sm text-emerald-50/70">Next stop: candidate dashboard and AI interview prep.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {callbackSteps.map((step, index) => (
            <article
              key={step.title}
              className="animate-rise rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5"
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Step {index + 1}</span>
                <CheckCircle2 className="size-4 text-emerald-300" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{step.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex rounded-2xl bg-white/10 p-3">
              <Radar className="size-6 text-cyan-200" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">What is available now</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              The candidate side can now render skill radar views, growth themes, and question sets tailored to the role that triggered the auth flow.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Profile summary hydrated",
              "Role-fit score stored",
              "Interview prompts prepared",
              "Navigation state linked",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-white/75">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-full px-6">
            <Link href="/candidate">
              Open candidate portal
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/8 px-6 text-white hover:bg-white/12 hover:text-white">
            <Link href="/candidate/interviews/frontend-systems">
              Preview interview panel
              <Sparkles className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}