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

export default async function CandidateLayout({ children }: CandidateLayoutProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login?next=/candidate");
  }

  let applicantName = getAuthUserDisplayName(data.user) ?? data.user.email ?? "Applicant";
  let githubLogin = getAuthUserGitHubLogin(data.user);
  let fitBand: string | null = null;
  let matchSummary: string | null = null;

  try {
    const profile = await ensureProfileForAuthUser(data.user);
    if (profile) {
      applicantName = profile.display_name || profile.github_login || profile.email || applicantName;
      githubLogin = profile.github_login || githubLogin;
    }
  } catch (profileError) {
    console.error("[candidate layout] profile lookup failed:", describeError(profileError));
  }

  try {
    const analysis = await getAnalysisByUserId(data.user.id);
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
