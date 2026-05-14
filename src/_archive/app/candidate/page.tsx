import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApplicantProfilePage } from "@/components/candidate/applicant-profile-page";
import { getAuthUserAvatarUrl, getAuthUserDisplayName, getAuthUserGitHubLogin } from "@/lib/auth-user";
import { getAnalysisByUserId } from "@/services/analyses.service";
import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Applicant Profile" };

const DEFAULT_JOB_DESCRIPTION = [
  "Role: Software Engineer",
  "Seniority: Mid to senior",
  "Role brief: Build and maintain production web applications using modern frameworks. Collaborate with product, design, and infrastructure teams.",
  "Must-have technologies: TypeScript, React or similar component framework, REST/GraphQL APIs, Git workflows.",
  "Interview brief: Evaluate the candidate's grasp of language fundamentals, code organization, async patterns, testing discipline, and ability to reason about real production code in their own repositories.",
].join("\n\n");

export default async function CandidateProfilePage() {
  const cookieStore = await cookies();
  const demoGithubUsername = cookieStore.get("demo_github_username")?.value;

  if (!demoGithubUsername) {
    redirect("/login?next=/candidate");
  }

  const applicantName = demoGithubUsername;
  const githubLogin = demoGithubUsername;
  const avatarUrl = null;
  const email = null;

  let initialAnalysis = null;
  try {
    const stored = await getAnalysisByUserId("00000000-0000-0000-0000-000000000000");
    initialAnalysis = stored?.result ?? null;
  } catch (lookupError) {
    console.error("Failed to load stored analysis", lookupError);
  }

  return (
    <ApplicantProfilePage
      applicantName={applicantName}
      githubLogin={githubLogin}
      avatarUrl={avatarUrl}
      email={email}
      initialAnalysis={initialAnalysis}
      defaultJobDescription={DEFAULT_JOB_DESCRIPTION}
    />
  );
}
