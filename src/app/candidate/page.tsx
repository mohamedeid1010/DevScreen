import type { Metadata } from "next";
import { CandidateProfileView } from "@/components/candidate/candidate-profile-view";

export const metadata: Metadata = { title: "Demo Candidate" };

export default function CandidateProfilePage() {
  return <CandidateProfileView />;
}
