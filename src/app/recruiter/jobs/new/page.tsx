import type { Metadata } from "next";
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

export const metadata: Metadata = { title: "Create Job" };

export default function NewJobPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-4">
        <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f99c0033] bg-[#f99c000d] px-4 py-2 text-sm text-[#f99c00]">
            <Sparkles className="size-4" />
            Multi-step creation flow
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f2eae3] sm:text-4xl">
            Define the role once, then let every downstream screen inherit the same intent.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#a8a29e]">
            This page is structured as a multi-step authoring flow so scorecards, profile fit, and interview generation all stay aligned.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-4">
                <div className="flex items-center justify-between text-sm text-[#a8a29e]">
                  <span>Step {index + 1}</span>
                  <Check className="size-4 text-[#00bb7f]" />
                </div>
                <h2 className="mt-3 text-base font-semibold text-[#f2eae3]">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#a8a29e]">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <form className="space-y-6 rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Role title
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="Frontend Platform Engineer"
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Hiring location
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="Cairo, Hybrid"
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Seniority level
              <select className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]" defaultValue="Senior">
                <option className="bg-[#111113]">Mid</option>
                <option className="bg-[#111113]">Senior</option>
                <option className="bg-[#111113]">Lead</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Hiring manager
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="Sara Ibrahim"
                type="text"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-[#a8a29e]">
            Role brief
            <textarea
              className="min-h-40 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
              defaultValue="Own the frontend platform roadmap, raise engineering leverage through design systems, and collaborate with hiring teams to define high-signal interview loops."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Must-have technologies
              <textarea
                className="min-h-32 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="React 19, Next.js 16, design systems, performance profiling, mentoring"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              AI interview brief
              <textarea
                className="min-h-32 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="Generate scenario-based questions around architecture tradeoffs, coaching style, and experimentation discipline."
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 rounded-xl px-5">Save and generate matches</Button>
            <Button variant="outline" className="h-11 rounded-xl border-[#ffffff12] bg-[#111113] px-5 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
              Continue to interview tuning
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#f99c001a] p-3">
              <SlidersHorizontal className="size-5 text-[#f99c00]" />
            </div>
            <div>
              <p className="text-sm text-[#a8a29e]">Scoring weights</p>
              <h2 className="text-2xl font-semibold text-[#f2eae3]">How the match engine will rank</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {scoreWeights.map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm text-[#a8a29e]">
                  <span>{item.label}</span>
                  <span className="font-mono text-[#f99c00]">{item.value}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#ffffff0a]">
                  <div
                    className="animate-grow-x h-full rounded-full"
                    style={{
                      width: `${item.value * 2.2}%`,
                      animationDelay: `${index * 120}ms`,
                      background: "linear-gradient(to right, #f99c00, #ffd236)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#f99c001a] p-3">
              <ClipboardList className="size-5 text-[#f99c00]" />
            </div>
            <div>
              <p className="text-sm text-[#a8a29e]">Downstream outputs</p>
              <h2 className="text-2xl font-semibold text-[#f2eae3]">What this setup powers</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              "Animated match result cards for each role route.",
              "Candidate-facing readiness narratives and growth priorities.",
              "AI-generated interview prompts bound to the job brief.",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[#ffffff0a] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
                {item}
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
