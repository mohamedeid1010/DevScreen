import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BriefcaseBusiness, GitBranch, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustSignals = [
  "Role-based access for recruiting teams and hiring managers.",
  "Shared scorecards flow directly into job match visualizations.",
  "Candidate OAuth callback can hydrate profile context in one step.",
];

export const metadata: Metadata = { title: "Recruiter Login" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-8 text-[#f2eae3] sm:px-10 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between rounded-2xl border border-[#ffffff12] bg-[#111113] p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f99c0033] bg-[#f99c000d] px-4 py-2 text-sm text-[#f99c00]">
              <Sparkles className="size-4" />
              Recruiter access
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Sign in to calibrate roles, review signals, and move faster than the funnel.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[#a8a29e]">
              This auth route lives inside a hidden route group, so your public URLs stay clean while your flows stay organized.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trustSignals.map((signal) => (
              <div key={signal} className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-4 text-sm leading-6 text-[#a8a29e]">
                {signal}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#00bb7f1a] bg-[#00bb7f0d] px-4 py-3 text-sm text-[#00bb7f]">
            <ShieldCheck className="size-4 shrink-0" />
            Single sign-on, audit-ready access, and candidate callback support in the same App Router tree.
          </div>
        </section>

        <section className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#f99c001a] p-3">
              <BriefcaseBusiness className="size-6 text-[#f99c00]" />
            </div>
            <div>
              <p className="text-sm text-[#a8a29e]">Team workspace</p>
              <h2 className="text-2xl font-semibold text-[#f2eae3]">Recruiter login</h2>
            </div>
          </div>

          <form className="mt-8 space-y-5">
            <label className="block space-y-2 text-sm font-medium text-[#a8a29e]">
              Work email
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="talent@devscreen.ai"
                type="email"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-[#a8a29e]">
              Password
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                defaultValue="••••••••••••"
                type="password"
              />
            </label>
            <Button className="h-12 w-full rounded-xl text-base">Continue to dashboard</Button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm text-[#a8a29e]/50">
            <span className="h-px flex-1 bg-[#ffffff12]" />
            or continue with
            <span className="h-px flex-1 bg-[#ffffff12]" />
          </div>

          <div className="grid gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-[#ffffff12] bg-[#111113] text-base text-[#f2eae3] hover:bg-[#17171a]">
              <GitBranch className="size-4" />
              GitHub SSO
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-[#ffffff12] bg-[#111113] text-base text-[#f2eae3] hover:bg-[#17171a]">
              Google Workspace
            </Button>
          </div>

          <div className="mt-8 rounded-xl bg-[#111113] p-5">
            <p className="text-sm font-medium text-[#f2eae3]">Testing the candidate OAuth callback?</p>
            <p className="mt-2 text-sm leading-6 text-[#a8a29e]">
              Jump to the callback route preview to confirm the hidden auth group is wired into the app tree.
            </p>
            <Button asChild variant="ghost" className="mt-3 h-10 rounded-full px-0 text-[#f2eae3] hover:bg-transparent">
              <Link href="/callback">
                Open callback preview
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
