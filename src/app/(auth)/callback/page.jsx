import Link from "next/link";
import { ArrowRight, CheckCircle2, GitBranch, Radar, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-[#f2eae3] sm:px-10">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#ffffff12] bg-[#111113] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#ffffff12] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f99c0033] bg-[#f99c000d] px-4 py-2 text-sm text-[#f99c00]">
              <GitBranch className="size-4" />
              Candidate OAuth callback
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Authentication finished. Candidate context is ready for the portal.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#a8a29e]">
              This route simulates the post-GitHub handoff where profile evidence, signal extraction, and interview generation all become available.
            </p>
          </div>

          <div className="rounded-xl border border-[#00bb7f1a] bg-[#00bb7f0d] px-5 py-4 text-right">
            <p className="text-sm text-[#a8a29e]">Readiness status</p>
            <p className="mt-1 text-3xl font-semibold text-[#00bb7f]">Portal synced</p>
            <p className="mt-2 text-sm text-[#a8a29e]">Next stop: candidate dashboard and AI interview prep.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {callbackSteps.map((step, index) => (
            <article
              key={step.title}
              className="animate-rise rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-5"
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <div className="flex items-center justify-between text-sm text-[#a8a29e]">
                <span>Step {index + 1}</span>
                <CheckCircle2 className="size-4 text-[#00bb7f]" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[#f2eae3]">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#a8a29e]">{step.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-xl border border-[#ffffff12] bg-[#0c0c0e] p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex rounded-xl bg-[#ffffff0a] p-3">
              <Radar className="size-6 text-[#ac4bff]" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[#f2eae3]">What is available now</h2>
            <p className="mt-3 text-sm leading-6 text-[#a8a29e]">
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
              <div key={item} className="rounded-xl border border-[#ffffff0a] bg-[#111113] px-4 py-4 text-sm text-[#a8a29e]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-xl px-6">
            <Link href="/candidate">
              Open candidate portal
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-[#ffffff12] bg-[#0c0c0e] px-6 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
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
