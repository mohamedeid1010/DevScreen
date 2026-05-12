import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Sparkles, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

const principles = [
  "Write a role once, then watch the shortlist update.",
  "Carry the same candidate story into the candidate lane.",
  "Keep the candidate context tied to the same role and reasoning.",
];

const lanes = [
  {
    title: "Recruiter lane",
    description: "Create the brief, open the shortlist, and review the featured candidate.",
    href: "/recruiter",
    icon: BriefcaseBusiness,
  },
  {
    title: "Candidate lane",
    description: "Read the same story from the candidate side.",
    href: "/candidate",
    icon: UserRoundSearch,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-[#f2eae3]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(228,0,43,0.08),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-[1280px] flex-col px-6 py-4 sm:px-10 lg:px-12">
        <main className="flex flex-1 flex-col justify-start py-6 lg:py-8">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e4002b33] bg-[#e4002b0d] px-4 py-2 font-mono text-xs text-[#ff6568]">
                <Sparkles className="size-3.5" />
                Demo mode
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                  One role brief. One candidate story. One interview flow.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#a8a29e]">
                  This project is now a straightforward frontend demo. The recruiter form changes the shortlist, and the same candidate story stays in sync across both lanes.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Auth is not wired yet, so these demo CTAs still jump directly into each lane instead of routing through /login first. */}
                <Button asChild size="lg" className="h-12 rounded-xl px-6">
                  <Link href="/recruiter">
                    Open recruiter lane
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-[#ffffff12] bg-[#111113] px-6 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
                  <Link href="/candidate">Open candidate lane</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {principles.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <section className="rounded-3xl border border-[#ffffff12] bg-[#111113] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">How this demo works</p>
                <div className="mt-5 space-y-4">
                  {[
                    "Start in the recruiter lane and edit the role brief.",
                    "Open matches to see which seeded candidate becomes the featured fit.",
                    "Jump to the candidate lane to verify the story stays consistent.",
                  ].map((item, index) => (
                    <div key={item} className="rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e] px-4 py-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Step {index + 1}</p>
                      <p className="mt-2 text-sm leading-6 text-[#d8d0ca]">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* These lane cards will eventually funnel through /login after auth is connected. */}
                {lanes.map((lane) => {
                  const Icon = lane.icon;

                  return (
                    <Link key={lane.href} href={lane.href} className="rounded-3xl border border-[#ffffff12] bg-[#0f0f12] p-5 transition hover:border-[#ffffff22] hover:bg-[#141418]">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffffff0a] text-[#f2eae3]">
                          <Icon className="size-4" />
                        </span>
                        <h2 className="text-lg font-semibold text-[#f2eae3]">{lane.title}</h2>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#a8a29e]">{lane.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
