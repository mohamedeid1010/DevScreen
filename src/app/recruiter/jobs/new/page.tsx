import { Check, ChevronRight, ClipboardList, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Role basics", detail: "Title, location, seniority, and reporting line." },
  { title: "Core signals", detail: "Skills, behaviors, and signals to weight heavily." },
  { title: "Evaluation logic", detail: "Scoring thresholds and evidence priorities." },
  { title: "Interview plan", detail: "Panel design and question generation preferences." },
];

const scoreWeights = [
  { label: "Hands-on frontend architecture", value: 35 },
  { label: "Design system ownership", value: 25 },
  { label: "Team enablement", value: 20 },
  { label: "AI-assisted workflow maturity", value: 20 },
];

export const metadata = {
  title: "Create Job",
};

export default function NewJobPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72">
            <Sparkles className="size-4 text-amber-300" />
            Multi-step creation flow
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Define the role once, then let every downstream screen inherit the same intent.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">
            This page is structured as a multi-step authoring flow so scorecards, profile fit, and interview generation all stay aligned.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between text-sm text-white/55">
                  <span>Step {index + 1}</span>
                  <Check className="size-4 text-emerald-300" />
                </div>
                <h2 className="mt-3 text-base font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/63">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <form className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-white/80">
              Role title
              <input
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-base text-white outline-none transition focus:border-cyan-300/40"
                defaultValue="Frontend Platform Engineer"
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Hiring location
              <input
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-base text-white outline-none transition focus:border-cyan-300/40"
                defaultValue="Cairo, Hybrid"
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Seniority level
              <select className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-base text-white outline-none transition focus:border-cyan-300/40" defaultValue="Senior">
                <option className="text-slate-950">Mid</option>
                <option className="text-slate-950">Senior</option>
                <option className="text-slate-950">Lead</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              Hiring manager
              <input
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-base text-white outline-none transition focus:border-cyan-300/40"
                defaultValue="Sara Ibrahim"
                type="text"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-white/80">
            Role brief
            <textarea
              className="min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-300/40"
              defaultValue="Own the frontend platform roadmap, raise engineering leverage through design systems, and collaborate with hiring teams to define high-signal interview loops."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-white/80">
              Must-have technologies
              <textarea
                className="min-h-32 w-full rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-300/40"
                defaultValue="React 19, Next.js 16, design systems, performance profiling, mentoring"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-white/80">
              AI interview brief
              <textarea
                className="min-h-32 w-full rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 text-base text-white outline-none transition focus:border-cyan-300/40"
                defaultValue="Generate scenario-based questions around architecture tradeoffs, coaching style, and experimentation discipline."
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 rounded-full px-5">Save and generate matches</Button>
            <Button variant="outline" className="h-11 rounded-full border-white/15 bg-white/8 px-5 text-white hover:bg-white/12 hover:text-white">
              Continue to interview tuning
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <SlidersHorizontal className="size-5 text-cyan-200" />
            </div>
            <div>
              <p className="text-sm text-white/55">Scoring weights</p>
              <h2 className="text-2xl font-semibold">How the match engine will rank</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {scoreWeights.map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="animate-grow-x h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300"
                    style={{ width: `${item.value * 2.2}%`, animationDelay: `${index * 120}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-300/12 p-3">
              <ClipboardList className="size-5 text-amber-200" />
            </div>
            <div>
              <p className="text-sm text-white/55">Downstream outputs</p>
              <h2 className="text-2xl font-semibold">What this setup powers</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {[
              "Animated match result cards for each role route.",
              "Candidate-facing readiness narratives and growth priorities.",
              "AI-generated interview prompts bound to the job brief.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-sm leading-6 text-white/70">
                {item}
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}