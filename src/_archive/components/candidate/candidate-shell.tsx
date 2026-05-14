"use client";

import type { ReactNode } from "react";
import {
  Compass,
  GitBranch,
  UserRound,
} from "lucide-react";
import { WorkspaceFrame } from "@/components/navigation/workspace-frame";

type CandidateShellProps = Readonly<{
  children: ReactNode;
  applicantName: string;
  githubLogin: string | null;
  fitBand: string | null;
  matchSummary: string | null;
}>;

export function CandidateShell({
  children,
  applicantName,
  githubLogin,
  fitBand,
  matchSummary,
}: CandidateShellProps) {
  const navItems = [
    {
      href: "/candidate",
      label: "Profile",
      caption: "Your GitHub profile and current analysis",
      icon: UserRound,
      match: (pathname: string) => pathname === "/candidate",
    },
  ];

  const hasAnalysis = fitBand !== null;
  const githubHandleLabel = githubLogin ? `github.com/${githubLogin}` : "No GitHub username on session";
  const spotlightTitle = githubLogin ? `github.com/${githubLogin}` : "Sign in with GitHub";
  const summaryValue = fitBand || "Pending analysis";
  const summaryDescription = hasAnalysis
    ? `Signed in as ${applicantName}. ${matchSummary ?? ""}`
    : `Signed in as ${applicantName}. Run your analysis to populate this lane.`;

  return (
    <WorkspaceFrame
      brandIcon={Compass}
      brandIconClassName="border-[#ffffff16] bg-[#f2eae3] text-[#09090b]"
      brandLabel="Applicant"
      brandTitle="Profile"
      headerDescription="Your profile is generated directly from your GitHub account."
      headerEyebrow="Applicant"
      headerStatus={[
        { label: hasAnalysis ? "Analyzed" : "Pending", variant: hasAnalysis ? "success" : "secondary" },
        { label: githubHandleLabel, variant: "secondary" },
      ]}
      headerTitle="Your applicant profile"
      navItems={navItems}
      spotlightDescription={matchSummary ?? "Run the analysis to generate your match summary."}
      spotlightIcon={GitBranch}
      spotlightLabel={hasAnalysis ? "Match summary" : "GitHub profile"}
      spotlightTitle={spotlightTitle}
      summaryDescription={summaryDescription}
      summaryLabel="Status"
      summaryValue={summaryValue}
    >
      {children}
    </WorkspaceFrame>
  );
}
