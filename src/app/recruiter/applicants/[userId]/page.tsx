import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAnalysisByUserId } from "@/services/analyses.service";
import { getProfileById } from "@/services/profile.service";

type ApplicantDetailPageProps = {
  params: Promise<{ userId: string }>;
};

function fitBandColors(fitBand: string | null | undefined) {
  if (fitBand === "Strong fit") return "border-[#3af28d33] bg-[#3af28d12] text-[#7af7aa]";
  if (fitBand === "Good fit") return "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]";
  if (fitBand === "Poor fit") return "border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568]";
  return "border-[#ffffff12] bg-[#ffffff08] text-[#a8a29e]";
}

export default async function ApplicantDetailPage({ params }: ApplicantDetailPageProps) {
  const { userId } = await params;
  const profile = await getProfileById(userId);

  if (!profile) {
    notFound();
  }

  const stored = await getAnalysisByUserId(userId).catch(() => null);
  const analysis = stored?.result ?? null;
  const fitBand = stored?.fit_band ?? null;

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="h-8 w-fit rounded-full px-0 text-[#a8a29e] hover:bg-transparent hover:text-[#f2eae3]">
        <Link href="/recruiter">
          <ArrowLeft className="size-3.5" />
          Back to applicants
        </Link>
      </Button>

      <Card className="bg-[#111113]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.github_login || "Applicant"}
                className="size-16 rounded-2xl border border-[#ffffff12]"
              />
            ) : (
              <div className="grid size-16 place-items-center rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] font-mono text-lg text-[#f2eae3]">
                {(profile.display_name || profile.github_login || "?").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Applicant</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#f2eae3]">
                {profile.display_name || profile.github_login || profile.email || "Unknown"}
              </h1>
              {profile.github_login ? (
                <a
                  href={`https://github.com/${profile.github_login}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-[#a8a29e] hover:text-[#f2eae3]"
                >
                  <GitBranch className="size-3.5" />
                  github.com/{profile.github_login}
                </a>
              ) : null}
              {profile.email ? <p className="mt-1 text-xs text-[#a8a29e]">{profile.email}</p> : null}
            </div>

            {fitBand ? (
              <span className={`rounded-full border px-3 py-1.5 font-mono text-xs ${fitBandColors(fitBand)}`}>
                {fitBand}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {!analysis ? (
        <Card className="bg-[#111113]">
          <CardContent className="p-8 text-center text-sm leading-6 text-[#a8a29e]">
            This applicant hasn&apos;t run their analysis yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-[#111113]">
            <CardContent className="p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8a29e]">Match summary</p>
              <p className="mt-3 text-sm leading-7 text-[#a8a29e]">{analysis.matchSummary}</p>
              <p className="mt-4 font-mono text-[11px] text-[#a8a29e]/60">
                AST complexity: {analysis.astComplexityScore}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-[#111113]">
              <CardContent className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#00bb7f]/70">Strengths</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.strengths.length === 0 ? (
                    <p className="text-sm text-[#a8a29e]">None.</p>
                  ) : analysis.strengths.map((s) => (
                    <span key={s} className="rounded-full border border-[#00bb7f1a] bg-[#00bb7f0f] px-3 py-1.5 text-xs text-[#7ef0c8]">{s}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111113]">
              <CardContent className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#f99c00]/70">Watchouts</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.watchouts.length === 0 ? (
                    <p className="text-sm text-[#a8a29e]">None.</p>
                  ) : analysis.watchouts.map((w) => (
                    <span key={w} className="rounded-full border border-[#f99c001a] bg-[#f99c000d] px-3 py-1.5 text-xs text-[#f99c00]">{w}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {analysis.topCodeChunks?.length ? (
            <Card className="bg-[#111113]">
              <CardContent className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8a29e]">Top matched code</p>
                <div className="mt-3 space-y-3">
                  {analysis.topCodeChunks.slice(0, 5).map((chunk, i) => (
                    <div key={`${chunk.repo}-${chunk.file}-${i}`} className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-4">
                      <p className="font-mono text-xs text-[#f99c00]">{chunk.repo ?? "—"}</p>
                      <p className="mt-1 font-mono text-xs text-[#a8a29e]">{chunk.file ?? "—"}</p>
                      {chunk.complexity != null ? (
                        <p className="mt-1 text-xs text-[#a8a29e]">Cyclomatic complexity {chunk.complexity}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {analysis.interviewQuestions?.length ? (
            <Card className="bg-[#111113]">
              <CardContent className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8a29e]">Interview prompts</p>
                <ul className="mt-3 space-y-3">
                  {analysis.interviewQuestions.map((q, i) => (
                    <li key={i} className="border-l-2 border-[#f99c00] pl-3 text-sm leading-6 text-[#a8a29e]">
                      <span className="font-mono text-xs text-[#f99c00]">Q{i + 1}.</span> {q}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
