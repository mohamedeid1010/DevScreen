import type { Metadata } from "next";
import { MatchesView } from "@/components/recruiter/matches-view";
import { formatRoleTitleFromSlug } from "@/lib/demo-data";

type MatchPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `${formatRoleTitleFromSlug(id)} Matches` };
}

export default async function MatchesPage({ params }: MatchPageProps) {
  const { id } = await params;
  return <MatchesView jobSlug={id} />;
}
