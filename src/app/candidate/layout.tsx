"use client";

import type { ReactNode } from "react";
import {
  Compass,
  GitBranch,
  UserRound,
} from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { WorkspaceFrame } from "@/components/navigation/workspace-frame";

type CandidateLayoutProps = Readonly<{ children: ReactNode }>;

export default function CandidateLayout({ children }: CandidateLayoutProps) {
  const { featuredCandidate, featuredMatch, isReady, session } = useDemoSession();

  const navItems = [
    {
      href: "/candidate",
      label: "Dashboard",
      caption: "Shared profile signal and recruiter-facing evidence",
      icon: UserRound,
      match: (pathname: string) => pathname === "/candidate",
    },
  ];

  return (
    <WorkspaceFrame
      brandIcon={Compass}
      brandIconClassName="border-[#ffffff16] bg-[#f2eae3] text-[#09090b]"
      brandLabel="Candidate"
      brandTitle="Signal Portal"
      headerDescription="Read the same candidate story that powers the recruiter shortlist."
      headerEyebrow="Candidate Demo Lane"
      headerStatus={[
        { label: "Demo candidate", variant: "success" },
        { label: isReady ? session.job.title : "Loading demo", variant: "secondary" },
      ]}
      headerTitle="Shared candidate story"
      navItems={navItems}
      spotlightDescription={isReady ? featuredMatch.matchSummary : "Preparing the featured profile and its shared reasoning."}
      spotlightIcon={GitBranch}
      spotlightLabel="Featured profile"
      spotlightTitle={isReady ? `github.com/${featuredCandidate.githubHandle}` : "Loading current profile"}
      summaryDescription={isReady ? `Role brief: ${session.job.title}. Featured readout: ${featuredMatch.fitBand}.` : "Waiting for the role and candidate story to hydrate."}
      summaryLabel="Recruiter readout"
      summaryValue={isReady ? featuredMatch.fitBand : "Loading demo"}
    >
      {children}
    </WorkspaceFrame>
  );
}
