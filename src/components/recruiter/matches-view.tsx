"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  GitBranch,
  ShieldAlert,
  Sparkles,
  UserRoundSearch,
  X,
} from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Button } from "@/components/ui/button";
import { formatRoleTitleFromSlug, type DemoMatchSummary, type FitBand } from "@/lib/demo-data";
import { type AnalysisResult } from "@/lib/types";

type MatchesViewProps = {
  jobSlug: string;
};

type ProgressStage = "idle" | "github" | "embeddings" | "insights" | "done";

type AnalyzeStreamEvent =
  | { stage: "github" | "embeddings" | "insights" }
  | { stage: "done"; result: AnalysisResult }
  | { stage: "error"; message: string };

type RankedMatch = Pick<
  DemoMatchSummary,
  "id" | "name" | "initials" | "location" | "stage" | "topRepo" | "matchSummary" | "strengths" | "watchouts"
> & {
  fitBand: FitBand | "Poor fit";
  isLive?: boolean;
};

function fitBandStyle(fitBand: FitBand | "Poor fit") {
  if (fitBand === "Strong fit") {
    return {
      text: "text-[#00bb7f]",
      bg: "bg-[#00bb7f0f]",
      border: "border-[#00bb7f1a]",
      ring: 82,
    };
  }

  if (fitBand === "Good fit") {
    return {
      text: "text-[#f99c00]",
      bg: "bg-[#f99c000d]",
      border: "border-[#f99c001a]",
      ring: 61,
    };
  }

  return {
    text: "text-[#a8a29e]",
    bg: "bg-[#ffffff0a]",
    border: "border-[#ffffff12]",
    ring: 38,
  };
}

function buildInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "GH";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function MatchesView({ jobSlug }: MatchesViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [analysisJobSlug, setAnalysisJobSlug] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveData, setLiveData] = useState<AnalysisResult | null>(null);
  const [jobDescriptionError, setJobDescriptionError] = useState("");
  const [progressStage, setProgressStage] = useState<ProgressStage>("idle");

  const {
    isReady,
    candidateHref,
    featuredCandidate,
    featuredMatch,
    setLiveAnalysis,
    session,
    syncToSlug,
  } = useDemoSession();

  useEffect(() => {
    syncToSlug(jobSlug);
  }, [jobSlug, syncToSlug]);

  const isJobContextReady = isReady && session.job.slug === jobSlug;
  const roleTitle = isJobContextReady ? session.job.title : formatRoleTitleFromSlug(jobSlug);
  const activeLiveData = analysisJobSlug === jobSlug ? liveData : null;
  const currentProgressStage = analysisJobSlug === jobSlug ? progressStage : "idle";
  const isLiveAnalysis = activeLiveData !== null;
  const liveGithubHandle = activeLiveData?.githubProfile?.login?.trim() || "";
  const liveGithubHref = liveGithubHandle ? `https://github.com/${liveGithubHandle}` : null;
  const liveShortlistMatch: RankedMatch | null = activeLiveData
    ? {
        id: activeLiveData.githubProfile.login || liveGithubHandle,
        name: activeLiveData.githubProfile.name || activeLiveData.githubProfile.login || "GitHub Candidate",
        initials: buildInitials(activeLiveData.githubProfile.name || activeLiveData.githubProfile.login || "GitHub Candidate"),
        location: activeLiveData.githubProfile.location || "Remote",
        fitBand: activeLiveData.fitBand,
        stage: "Live analysis result",
        topRepo: activeLiveData.topCodeChunks[0]?.repo || "—",
        matchSummary: activeLiveData.matchSummary,
        strengths: activeLiveData.strengths,
        watchouts: activeLiveData.watchouts,
        isLive: true,
      }
    : null;
  const rankedMatches: RankedMatch[] = liveShortlistMatch
    ? [liveShortlistMatch, ...session.matches]
    : session.matches;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProgressStage("idle");
    if (!githubUsername || !isJobContextReady) return;

    const { job } = session;

    if (!job.roleBrief.trim()) {
      setJobDescriptionError("Please save a job brief first");
      return;
    }

    const jobDescription = [
      `Role: ${job.title}`,
      `Seniority: ${job.seniority}`,
      `Role brief: ${job.roleBrief}`,
      `Must-have technologies: ${job.mustHaveTechnologies}`,
      `Interview brief: ${job.interviewBrief}`,
    ].join("\n\n");

    setJobDescriptionError("");
    setIsAnalyzing(true);
    setAnalysisJobSlug(jobSlug);
    setProgressStage("github");
    setLiveData(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUsername: githubUsername.trim(),
          jobDescription,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message = `Analysis failed with status ${res.status}`;

        if (errorText) {
          try {
            const parsed = JSON.parse(errorText) as { error?: string };
            message = parsed.error || message;
          } catch {
            message = errorText;
          }
        }

        throw new Error(message);
      }

      if (!res.body) {
        throw new Error("Analysis stream unavailable");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let shouldStop = false;

      const handleStreamEvent = (event: AnalyzeStreamEvent) => {
        if (event.stage === "error") {
          setError(event.message);
          setProgressStage("idle");
          return true;
        }

        if (event.stage === "done") {
          setProgressStage("done");
          setLiveData(event.result);
          setLiveAnalysis(event.result);
          return true;
        }

        setProgressStage(event.stage);
        return false;
      };

      while (!shouldStop) {
        const { value, done } = await reader.read();

        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }

        if (done) {
          buffer += decoder.decode();
        }

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (!trimmedLine) {
            continue;
          }

          const event = JSON.parse(trimmedLine) as AnalyzeStreamEvent;
          shouldStop = handleStreamEvent(event);

          if (shouldStop) {
            await reader.cancel();
            break;
          }
        }

        if (done) {
          const finalLine = buffer.trim();

          if (!shouldStop && finalLine) {
            handleStreamEvent(JSON.parse(finalLine) as AnalyzeStreamEvent);
          }

          break;
        }
      }
    } catch (err: any) {
      setError(err.message);
      setProgressStage("idle");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const leader = activeLiveData ? {
      fitBand: activeLiveData.fitBand,
      matchSummary: activeLiveData.matchSummary,
      strengths: activeLiveData.strengths ?? [],
      watchouts: activeLiveData.watchouts ?? [],
      topRepo: activeLiveData.topCodeChunks?.[0]?.repo || "Multiple",
      complexityScore: activeLiveData.astComplexityScore,
      interviewQuestions: activeLiveData.interviewQuestions ?? [],
  } : featuredMatch;

  const candidateName = activeLiveData ? (activeLiveData.githubProfile?.name || activeLiveData.githubProfile?.login) : featuredCandidate.name;
  const candidateLocation = activeLiveData ? (activeLiveData.githubProfile?.location || "Remote") : featuredCandidate.location;
  const leaderStyle = fitBandStyle(leader.fitBand);
  const analyzeButtonLabel = !isAnalyzing
    ? "Run AI Analysis"
    : currentProgressStage === "github"
      ? "Fetching GitHub..."
      : currentProgressStage === "embeddings"
        ? "Analyzing code..."
        : currentProgressStage === "insights"
          ? "Generating insights..."
          : "Run AI Analysis";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Button asChild variant="ghost" className="h-8 rounded-full px-0 text-[#a8a29e] hover:bg-transparent hover:text-[#f2eae3]">
              <Link href="/recruiter">
                <ArrowLeft className="size-3.5" />
                Back to dashboard
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00bb7f1a] bg-[#00bb7f0d] px-3 py-1 font-mono text-xs text-[#7ef0c8]">
                {isLiveAnalysis ? "Live candidate" : "Featured candidate"}
              </span>
              <span className={`rounded-full border px-3 py-1 font-mono text-xs ${leaderStyle.text} ${leaderStyle.bg} ${leaderStyle.border}`}>{leader.fitBand}</span>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Match Results</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#f2eae3] sm:text-4xl">{roleTitle}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#a8a29e]">
                {leader.matchSummary}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isLiveAnalysis ? (
                liveGithubHref ? (
                  <Button asChild className="h-11 rounded-xl px-5">
                    <a href={liveGithubHref} target="_blank" rel="noreferrer">
                      Open GitHub profile
                    </a>
                  </Button>
                ) : (
                  <Button disabled className="h-11 rounded-xl px-5">
                    GitHub profile unavailable
                  </Button>
                )
              ) : (
                <Button asChild className="h-11 rounded-xl px-5">
                  <Link href={candidateHref}>Open candidate story</Link>
                </Button>
              )}

              {isLiveAnalysis ? (
                <Button asChild variant="outline" className="h-11 rounded-xl px-5">
                  <Link href={candidateHref}>Open demo candidate story</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-5 lg:w-[260px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e]">{isLiveAnalysis ? "Live top match" : "Top match"}</p>
            <p className="mt-2 text-2xl font-semibold text-[#f2eae3]">{candidateName}</p>
            <p className="mt-2 text-sm text-[#a8a29e]">{candidateLocation}</p>
            <div className={`mt-4 inline-flex rounded-full border px-3 py-1 font-mono text-xs ${leaderStyle.text} ${leaderStyle.bg} ${leaderStyle.border}`}>
              {leader.fitBand}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#a8a29e]">Top repo: {leader.topRepo}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
        {error ? (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#e4002b33] bg-[#e4002b0d] p-4 text-[#ff6568]" role="alert">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-[#ff6568]/80">Analysis error</p>
              <p className="mt-1 text-sm leading-6 text-[#ff6568]">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568] transition hover:bg-[#e4002b1a]"
              aria-label="Dismiss analysis error"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}
        <form onSubmit={handleAnalyze} className="flex gap-3 items-center">
           <input 
             type="text" 
             placeholder="Enter GitHub Username to Analyze..." 
             className="flex-1 bg-[#0c0c0e] border border-[#ffffff12] rounded-xl px-4 h-11 text-sm text-[#f2eae3] placeholder:text-[#a8a29e]"
             value={githubUsername}
             onChange={(e) => setGithubUsername(e.target.value)}
           />
           <Button type="submit" disabled={isAnalyzing || !isJobContextReady} className="h-11 rounded-xl px-5 bg-[#f99c00] text-black hover:bg-[#f99c00]/90">
             {analyzeButtonLabel}
           </Button>
        </form>
        {jobDescriptionError ? (
          <p className="mt-3 text-xs leading-6 text-[#ff6568]" role="alert">
            {jobDescriptionError}
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-6 text-[#a8a29e]">
          {isJobContextReady
            ? `Analysis uses the active role brief, must-have technologies, and interview brief for ${session.job.title}.`
            : "Loading the active role brief before analysis."}
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Ranked Shortlist</p>
              <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">
                {isLiveAnalysis ? "Live result with seeded comparison" : "Candidates for this seeded role"}
              </h2>
              {isLiveAnalysis ? (
                <p className="mt-1 text-xs leading-5 text-[#a8a29e]">
                  The live GitHub analysis is pinned first, with seeded candidates below for side-by-side comparison.
                </p>
              ) : null}
            </div>
            <UserRoundSearch className="size-4 text-[#f99c00]" />
          </div>

          <div className="space-y-2.5">
            {rankedMatches.map((candidate, index) => {
              const style = fitBandStyle(candidate.fitBand);
              const isLiveCandidate = candidate.isLive === true;
              const isTop = isLiveCandidate || (!isLiveAnalysis && candidate.id === session.featuredCandidateId);

              return (
                <div
                  key={candidate.id}
                  className={`animate-rise rounded-xl border p-4 ${isLiveCandidate ? "border-[#00bb7f1a] bg-[#00bb7f0f]" : isTop ? "border-[#f99c001a] bg-[#f99c000d]" : "border-[#ffffff0a] bg-[#0c0c0e] hover:bg-[#111113]"}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold ${isLiveCandidate ? "bg-[#00bb7f1a] text-[#7ef0c8]" : isTop ? "bg-[#f99c001a] text-[#f99c00]" : "bg-[#ffffff0a] text-[#a8a29e]"}`}>
                        {candidate.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#f2eae3]">{candidate.name}</h3>
                          {isLiveCandidate ? <span className="font-mono text-[10px] text-[#7ef0c8]">LIVE</span> : isTop ? <span className="font-mono text-[10px] text-[#f99c00]">FEATURED</span> : null}
                        </div>
                        <p className="mt-0.5 text-xs text-[#a8a29e]">{candidate.location}</p>
                      </div>
                    </div>
                    <div className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-xs font-semibold ${style.text} ${style.bg} ${style.border}`}>
                      {candidate.fitBand}
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5">
                    <GitBranch className="size-3 text-[#a8a29e]/40" />
                    <span className="font-mono text-[10px] text-[#a8a29e]/60">{candidate.topRepo}</span>
                  </div>

                  <div className="mt-2.5 h-1 rounded-full bg-[#ffffff0a]">
                    <div
                      className="animate-grow-x h-full rounded-full"
                      style={{
                        width: `${style.ring}%`,
                        background: isLiveCandidate
                          ? "linear-gradient(90deg, #00bb7f, #7ef0c8)"
                          : isTop
                            ? "linear-gradient(90deg, #f99c00, #ffd236)"
                            : "rgba(255,255,255,0.18)",
                        animationDelay: `${index * 120}ms`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#a8a29e]/70">{candidate.stage}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {isTop ? (
                      <Button asChild className="h-9 rounded-xl px-4 text-sm">
                        <Link href={candidateHref}>{isLiveCandidate ? "Open candidate story" : isLiveAnalysis ? "Open demo candidate story" : "Open candidate story"}</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#f99c001a] bg-[#111113] p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Sparkles className="size-3.5 text-[#f99c00]" />
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#f99c00]/70">
                Shared recruiter reasoning
              </p>
              <span className="ml-auto rounded-full border border-[#ffffff12] bg-[#ffffff0a] px-2 py-0.5 font-mono text-[10px] text-[#a8a29e]">
                {activeLiveData ? "Live AI Analysis" : "Demo candidate"}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#f2eae3]">{candidateName}</h2>
            <div className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${leaderStyle.border} ${leaderStyle.bg}`}>
              <span className={`font-mono text-xs font-bold ${leaderStyle.text}`}>{leader.fitBand}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#a8a29e]">{leader.matchSummary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#00bb7f1a] bg-[#00bb7f0f] p-4">
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-[#00bb7f]/70">Strengths</p>
              <div className="flex flex-wrap gap-1.5">
                {leader.strengths.map((strength: string) => (
                  <span key={strength} className="rounded-full border border-[#00bb7f1a] bg-[#00bb7f0d] px-2.5 py-1 text-xs text-[#00bb7f]">
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#f99c001a] bg-[#f99c000d] p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldAlert className="size-3.5 text-[#f99c00]/70" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#f99c00]/70">Watchouts</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {leader.watchouts.map((watchout: string) => (
                  <span key={watchout} className="rounded-full border border-[#f99c001a] bg-[#f99c000d] px-2.5 py-1 text-xs text-[#f99c00]">
                    {watchout}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {activeLiveData && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#00bb7f1a] bg-[#111113] p-6">
                <h3 className="text-sm font-semibold text-[#f2eae3]">Code Complexity (AST)</h3>
                <p className="mt-1 text-3xl font-mono text-[#00bb7f]">{activeLiveData.astComplexityScore}</p>
                <p className="mt-1 text-xs text-[#a8a29e]">Average Cyclomatic Complexity of top files</p>
              </div>
              <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
                <h3 className="text-sm font-semibold text-[#f2eae3]">Generated Interview Questions</h3>
                <ul className="mt-3 space-y-3">
                  {activeLiveData.interviewQuestions?.map((q: string, i: number) => (
                    <li key={i} className="text-sm text-[#a8a29e] border-l-2 border-[#f99c00] pl-3 leading-6">{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
