import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GitFork, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustSignals = [
  "Role-based access for recruiting teams and hiring managers.",
  "Shared scorecards flow directly into job match visualizations.",
  "Candidate OAuth callback can hydrate profile context in one step.",
];

export const metadata = {
  title: "Recruiter Login",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0f172a_0%,#1e293b_42%,#082f49_100%)] px-6 py-8 text-white sm:px-10 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_32px_70px_rgba(2,6,23,0.4)] backdrop-blur">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/80">
              <Sparkles className="size-4 text-amber-300" />
              Recruiter access
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Sign in to calibrate roles, review signals, and move faster than the funnel.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/70">
              This auth route lives inside a hidden route group, so your public URLs stay clean while your flows stay organized.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trustSignals.map((signal) => (
              <div key={signal} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-white/75">
                {signal}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <ShieldCheck className="size-4" />
            Single sign-on, audit-ready access, and candidate callback support in the same App Router tree.
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/20 bg-white p-8 text-slate-950 shadow-[0_32px_70px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <BriefcaseBusiness className="size-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Team workspace</p>
              <h2 className="text-2xl font-semibold">Recruiter login</h2>
            </div>
          </div>

          <form className="mt-8 space-y-5">
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Work email
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none transition focus:border-slate-950"
                defaultValue="talent@devscreen.ai"
                type="email"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Password
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-950 outline-none transition focus:border-slate-950"
                defaultValue="••••••••••••"
                type="password"
              />
            </label>

            <Button className="h-12 w-full rounded-2xl text-base">Continue to dashboard</Button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or continue with
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3">
            <Button variant="outline" className="h-12 rounded-2xl border-slate-200 bg-transparent text-base">
              <GitFork className="size-4" />
              GitHub SSO
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl border-slate-200 bg-transparent text-base">
              Google Workspace
            </Button>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-700">Testing the candidate OAuth callback?</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Jump to the callback route preview to confirm the hidden auth group is wired into the app tree.
            </p>
            <Button asChild variant="ghost" className="mt-3 h-10 rounded-full px-0 text-slate-950 hover:bg-transparent">
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