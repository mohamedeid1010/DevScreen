import type { Metadata } from "next";
import { NewJobFormView } from "@/components/recruiter/new-job-form-view";

export const metadata: Metadata = { title: "Create Job" };

export default function NewJobPage() {
  return <NewJobFormView />;
}
