import Link from "next/link";
import { ArrowRight, GitBranch, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/services/profile.service";
import type { StoredAnalysis } from "@/services/analyses.service";

type ApplicantsListProps = {
  applicants: Profile[];
  analysesByUserId: Map<string, StoredAnalysis>;
};

function fitBandColors(fitBand: string | null | undefined) {
  if (fitBand === "Strong fit") return "border-[#3af28d33] bg-[#3af28d12] text-[#7af7aa]";
  if (fitBand === "Good fit") return "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]";
  if (fitBand === "Poor fit") return "border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568]";
  return "border-[#ffffff12] bg-[#ffffff08] text-[#a8a29e]";
}

function formatRelativeDate(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ApplicantsList({ applicants, analysesByUserId }: ApplicantsListProps) {
  if (applicants.length === 0) {
    return (
      <Card className="bg-[#111113]">
        <CardContent className="p-10 text-center">
          <Users className="mx-auto size-8 text-[#a8a29e]" />
          <h2 className="mt-4 text-xl font-semibold text-[#f2eae3]">No applicants yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#a8a29e]">
            Applicants appear here after they sign in with GitHub. Share the login link with candidates to start populating the pipeline.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-[#111113]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Applicants</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#f2eae3]">
                {applicants.length} signed in
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#a8a29e]">
                Click an applicant to view their GitHub-backed analysis.
              </p>
            </div>
            <Users className="size-6 text-[#a8a29e]" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {applicants.map((applicant) => {
          const analysis = analysesByUserId.get(applicant.id);
          const fitBand = analysis?.fit_band ?? null;
          const updated = formatRelativeDate(analysis?.analyzed_at ?? applicant.last_sign_in_at ?? applicant.updated_at);
          const detailHref = `/recruiter/applicants/${applicant.id}`;

          return (
            <Link
              key={applicant.id}
              href={detailHref}
              className="block rounded-2xl border border-[#ffffff12] bg-[#111113] p-4 transition hover:border-[#ffffff22] hover:bg-[#17171a]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  {applicant.avatar_url ? (
                    <img
                      src={applicant.avatar_url}
                      alt={applicant.display_name || applicant.github_login || "Applicant"}
                      className="size-12 rounded-xl border border-[#ffffff12]"
                    />
                  ) : (
                    <div className="grid size-12 place-items-center rounded-xl border border-[#ffffff12] bg-[#0c0c0e] font-mono text-sm text-[#f2eae3]">
                      {(applicant.display_name || applicant.github_login || "?").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[#f2eae3]">
                      {applicant.display_name || applicant.github_login || applicant.email || "Unknown applicant"}
                    </p>
                    {applicant.github_login ? (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs text-[#a8a29e]">
                        <GitBranch className="size-3" />
                        github.com/{applicant.github_login}
                      </p>
                    ) : null}
                    {analysis?.match_summary ? (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a8a29e] line-clamp-2">
                        {analysis.match_summary}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-[#a8a29e]">Analysis pending.</p>
                    )}
                    {updated ? (
                      <p className="mt-2 font-mono text-[11px] text-[#a8a29e]/60">{updated}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 font-mono text-xs ${fitBandColors(fitBand)}`}
                  >
                    {fitBand ?? "No analysis"}
                  </span>
                  <ArrowRight className="size-4 text-[#a8a29e]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
