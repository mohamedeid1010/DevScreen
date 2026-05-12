import type { Metadata } from "next";
import { CheckCircle2, GitBranch } from "lucide-react";
import { CallbackPreviewActions } from "@/components/demo/callback-preview-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Recruiter Callback" };

export default function CallbackPage() {
  const nextHref = "/recruiter";
  const callbackSteps = [
    {
      title: "GitHub identity verified",
      detail: "This preview simulates a successful GitHub handoff for an approved recruiter account.",
    },
    {
      title: "Recruiter access confirmed",
      detail: "Candidate branching is disabled in this flow. Approved users continue directly to the recruiter workspace.",
    },
    {
      title: "Workspace linked",
      detail: "The demo recruiter session is ready to continue into the console.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-[#f2eae3] sm:px-10">
      <Card className="mx-auto max-w-4xl bg-[#111113] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <CardHeader className="border-b border-[#ffffff12] p-8 pb-8 sm:p-10 sm:pb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Badge className="px-4 py-2 text-[11px]">
                <GitBranch className="size-3.5" />
                Recruiter callback preview
              </Badge>
              <CardTitle className="mt-5 text-4xl sm:text-5xl">
                Callback preview resolved.
              </CardTitle>
              <CardDescription className="mt-4 max-w-2xl text-lg leading-8">
                GitHub sign-in completed. This placeholder callback now routes approved users straight into the recruiter lane.
              </CardDescription>
            </div>

            <Card className="border-[#e4002b1a] bg-[#e4002b0d] shadow-none">
              <CardContent className="p-5 text-right">
                <p className="text-sm text-[#a8a29e]">Next route</p>
                <p className="mt-1 text-3xl font-semibold text-[#ff6568]">Recruiter</p>
                <p className="mt-2 text-sm text-[#a8a29e]">Primary destination: {nextHref}</p>
              </CardContent>
            </Card>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-8 sm:p-10 sm:pt-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {callbackSteps.map((step, index) => (
              <Card
                key={step.title}
                className="animate-rise bg-[#0c0c0e] shadow-none"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between text-sm text-[#a8a29e]">
                    <span>Step {index + 1}</span>
                    <CheckCircle2 className="size-4 text-[#ff6568]" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-[#f2eae3]">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#a8a29e]">{step.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-sm leading-6 text-[#a8a29e]">
            Real OAuth would validate the GitHub account against the recruiter allowlist before continuing. This preview keeps the flow recruiter-only.
          </p>

          <CallbackPreviewActions
            alternateHref="/login"
            alternateLabel="Back to GitHub sign in"
            primaryHref={nextHref}
            primaryLabel="Open recruiter lane"
          />
        </CardContent>
      </Card>
    </div>
  );
}
