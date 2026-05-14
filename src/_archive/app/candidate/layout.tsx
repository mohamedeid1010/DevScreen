import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CandidateShell } from "@/components/candidate/candidate-shell";
import { getAnalysisByUserId } from "@/services/analyses.service";
import { ensureProfileForAuthUser } from "@/services/profile.service";
import { getAuthUserDisplayName, getAuthUserGitHubLogin } from "@/lib/auth-user";
import { createClient } from "@/utils/supabase/server";

type CandidateLayoutProps = Readonly<{ children: ReactNode }>;

function describeError(err: unknown) {
  if (!err) return "unknown";
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as { message?: string; code?: string; details?: string; hint?: string };
    return [e.message, e.code, e.details, e.hint].filter(Boolean).join(" | ") || JSON.stringify(err);
  }
  return String(err);
}

import { cookies } from "next/headers";

export default async function CandidateLayout({ children }: CandidateLayoutProps) {
  const cookieStore = await cookies();
  const demoGithubUsername = cookieStore.get("demo_github_username")?.value;

  if (!demoGithubUsername) {
    redirect("/login?next=/candidate");
  }

  let applicantName = demoGithubUsername;
  let githubLogin = demoGithubUsername;
  let fitBand: string | null = null;
  let matchSummary: string | null = null;

  try {
    const analysis = await getAnalysisByUserId("00000000-0000-0000-0000-000000000000");
    if (analysis) {
      fitBand = analysis.fit_band;
      matchSummary = analysis.match_summary;
    }
  } catch (analysisError) {
    console.error("[candidate layout] analysis lookup failed:", describeError(analysisError));
  }

  return (
    <CandidateShell
      applicantName={applicantName}
      githubLogin={githubLogin}
      fitBand={fitBand}
      matchSummary={matchSummary}
    >
      {children}
    </CandidateShell>
  );
}
