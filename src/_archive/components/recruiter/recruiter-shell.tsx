"use client";

import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  LayoutDashboard,
  Target,
} from "lucide-react";
import { WorkspaceFrame } from "@/components/navigation/workspace-frame";

type RecruiterShellProps = Readonly<{
  children: ReactNode;
  applicantCount: number;
}>;

export function RecruiterShell({ children, applicantCount }: RecruiterShellProps) {
  const navItems = [
    {
      href: "/recruiter",
      label: "Applicants",
      caption: "All applicants who have signed in",
      icon: LayoutDashboard,
      match: (pathname: string) => pathname === "/recruiter",
    },
    {
      href: "/recruiter/analytics",
      label: "Analytics",
      icon: BarChart3,
      match: (pathname: string) => pathname === "/recruiter/analytics",
    },
  ];

  const applicantSummary = `${applicantCount} applicant${applicantCount === 1 ? "" : "s"}`;

  return (
    <WorkspaceFrame
      brandHref="/recruiter"
      brandIcon={BriefcaseBusiness}
      brandIconClassName="border-[#e4002b33] bg-[#e4002b] text-[#fafaf9]"
      brandLabel="Admin"
      brandTitle="DevScreen Console"
      headerDescription="Review the applicants who have signed in and the analyses generated from their GitHub profiles."
      headerEyebrow="Admin Console"
      headerStatus={[
        { label: "Admin", variant: "success" },
        { label: applicantSummary, variant: "secondary" },
      ]}
      headerTitle="Applicant intelligence"
      navItems={navItems}
      spotlightDescription={`${applicantCount} applicant${applicantCount === 1 ? "" : "s"} have signed in so far.`}
      spotlightIcon={Target}
      spotlightLabel="Live pipeline"
      spotlightTitle={applicantSummary}
      summaryDescription="Click an applicant to review their analysis."
      summaryLabel="Pipeline"
      summaryValue={applicantSummary}
      showHeader={false}
      topLinkHref="/recruiter"
      topLinkLabel="Console"
    >
      {children}
    </WorkspaceFrame>
  );
}
