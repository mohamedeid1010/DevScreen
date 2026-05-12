import type { Metadata } from "next";
import { RecruiterIntelligenceOverview } from "@/components/recruiter/recruiter-intelligence-overview";

export const metadata: Metadata = { title: "Recruiter Dashboard" };

export default function RecruiterDashboardPage() {
  return <RecruiterIntelligenceOverview />;
}
