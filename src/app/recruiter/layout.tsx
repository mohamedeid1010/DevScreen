"use client";

import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  LayoutDashboard,
  Target,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { WorkspaceFrame } from "@/components/navigation/workspace-frame";

type RecruiterLayoutProps = Readonly<{ children: ReactNode }>;

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const { featuredCandidate, featuredMatch, isReady, matchesHref, session } = useDemoSession();
  const currentMatchesHref = isReady ? matchesHref : "/recruiter/jobs/new";

  const navItems = [
    {
      href: "/recruiter",
      label: "Overview",
      caption: "Demo lane overview and current role context",
      icon: LayoutDashboard,
      match: (pathname: string) => pathname === "/recruiter",
    },
    {
      href: "/recruiter/jobs/new",
      label: "New role",
      caption: "Author one brief for every shared screen",
      icon: WandSparkles,
      match: (pathname: string) => pathname === "/recruiter/jobs/new",
    },
    {
      href: currentMatchesHref,
      label: "Matches",
      caption: "Review the shortlist tied to the active demo session",
      icon: UsersRound,
      match: (pathname: string) => pathname.startsWith("/recruiter/jobs/") && pathname.endsWith("/matches"),
    },
    {
      href: "/recruiter/analytics",
      label: "Analytics",
      icon: BarChart3,
      match: (pathname: string) => pathname === "/recruiter/analytics",
    },
  ];

  return (
    <WorkspaceFrame
      brandHref="/recruiter"
      brandIcon={BriefcaseBusiness}
      brandIconClassName="border-[#e4002b33] bg-[#e4002b] text-[#fafaf9]"
      brandLabel="Recruiter"
      brandTitle="Devscreen Console"
      headerDescription="Write one role brief and follow the same candidate story through the rest of the demo."
      headerEyebrow="Recruiter Demo Lane"
      headerStatus={[
        { label: "Demo mode", variant: "success" },
        { label: isReady ? session.job.title : "Loading demo", variant: "secondary" },
      ]}
      headerTitle="Shared recruiter workflow"
      navItems={navItems}
      spotlightDescription={isReady ? featuredMatch.matchSummary : "Preparing the current shortlist and recruiter reasoning."}
      spotlightIcon={Target}
      spotlightLabel="Current brief"
      spotlightTitle={isReady ? session.job.title : "Loading current role"}
      summaryDescription={isReady ? `Featured candidate: ${featuredCandidate.name}. The same strengths and watchouts appear everywhere else.` : "Waiting for the featured candidate and shared reasoning to hydrate."}
      summaryLabel="Featured readout"
      summaryValue={isReady ? featuredMatch.fitBand : "Loading demo"}
      showHeader={false}
      topLinkHref="/recruiter"
      topLinkLabel="Dashboard"
    >
      {children}
    </WorkspaceFrame>
  );
}
