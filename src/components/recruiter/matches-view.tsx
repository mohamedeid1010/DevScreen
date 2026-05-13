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
} from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Button } from "@/components/ui/button";
import { formatRoleTitleFromSlug, type FitBand } from "@/lib/demo-data";

type MatchesViewProps = {
  jobSlug: string;
};

function fitBandStyle(fitBand: FitBand) {
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

export function MatchesView({ jobSlug }: MatchesViewProps) {
  const [githubUsername, setGithubUsername] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername) return;
    setIsAnalyzing(true);
    setLiveData(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUsername,
          jobDescription: "Senior Software Engineer. Must be proficient in TypeScript, React, and Node.js. Experience with system architecture and writing scalable, clean code is required." 
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLiveData(data);
    } catch (err: any) {
      alert("Analysis failed: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const {
    candidateHref,
    featuredCandidate,
    featuredMatch,
    session,
    syncToSlug,
  } = useDemoSession();

  useEffect(() => {
    syncToSlug(jobSlug);
  }, [jobSlug, syncToSlug]);

  const roleTitle = session.job.slug === jobSlug ? session.job.title : formatRoleTitleFromSlug(jobSlug);
  
  const leader = liveData ? {
      fitBand: liveData.fitBand,
      matchSummary: liveData.matchSummary,
      strengths: liveData.strengths,
      watchouts: liveData.watchouts,
      topRepo: liveData.topCodeChunks?.[0]?.repo || "Multiple",
      complexityScore: liveData.astComplexityScore,
      interviewQuestions: liveData.interviewQuestions,
  } : featuredMatch;

  const candidateName = liveData ? (liveData.githubProfile?.name || liveData.githubProfile?.login) : featuredCandidate.name;
  const candidateLocation = liveData ? (liveData.githubProfile?.location || "Remote") : featuredCandidate.location;

  const leaderStyle = fitBandStyle(leader.fitBand as FitBand);

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
                Featured candidate
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
              <Button asChild className="h-11 rounded-xl px-5">
                <Link href={candidateHref}>Open candidate story</Link>
              </Button>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-5 lg:w-[260px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e]">Top match</p>
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
        <form onSubmit={handleAnalyze} className="flex gap-3 items-center">
           <input 
             type="text" 
             placeholder="Enter GitHub Username to Analyze..." 
             className="flex-1 bg-[#0c0c0e] border border-[#ffffff12] rounded-xl px-4 h-11 text-sm text-[#f2eae3] placeholder:text-[#a8a29e]"
             value={githubUsername}
             onChange={(e) => setGithubUsername(e.target.value)}
           />
           <Button type="submit" disabled={isAnalyzing} className="h-11 rounded-xl px-5 bg-[#f99c00] text-black hover:bg-[#f99c00]/90">
             {isAnalyzing ? "Analyzing Pipeline..." : "Run AI Analysis"}
           </Button>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <article className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Ranked Shortlist</p>
              <h2 className="mt-0.5 text-lg font-semibold text-[#f2eae3]">Candidates for this seeded role</h2>
            </div>
            <UserRoundSearch className="size-4 text-[#f99c00]" />
          </div>

          <div className="space-y-2.5">
            {session.matches.map((candidate, index) => {
              const style = fitBandStyle(candidate.fitBand);
              const isTop = candidate.id === session.featuredCandidateId;

              return (
                <div
                  key={candidate.id}
                  className={`animate-rise rounded-xl border p-4 ${isTop ? "border-[#f99c001a] bg-[#f99c000d]" : "border-[#ffffff0a] bg-[#0c0c0e] hover:bg-[#111113]"}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold ${isTop ? "bg-[#f99c001a] text-[#f99c00]" : "bg-[#ffffff0a] text-[#a8a29e]"}`}>
                        {candidate.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#f2eae3]">{candidate.name}</h3>
                          {isTop ? <span className="font-mono text-[10px] text-[#f99c00]">FEATURED</span> : null}
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
                        background: isTop ? "linear-gradient(90deg, #f99c00, #ffd236)" : "rgba(255,255,255,0.18)",
                        animationDelay: `${index * 120}ms`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[#a8a29e]/70">{candidate.stage}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {isTop ? (
                      <Button asChild className="h-9 rounded-xl px-4 text-sm">
                        <Link href={candidateHref}>Open candidate story</Link>
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
                {liveData ? "Live AI Analysis" : "Demo candidate"}
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

          {liveData && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#00bb7f1a] bg-[#111113] p-6">
                <h3 className="text-sm font-semibold text-[#f2eae3]">Code Complexity (AST)</h3>
                <p className="mt-1 text-3xl font-mono text-[#00bb7f]">{liveData.astComplexityScore}</p>
                <p className="mt-1 text-xs text-[#a8a29e]">Average Cyclomatic Complexity of top files</p>
              </div>
              <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
                <h3 className="text-sm font-semibold text-[#f2eae3]">Generated Interview Questions</h3>
                <ul className="mt-3 space-y-3">
                  {liveData.interviewQuestions?.map((q: string, i: number) => (
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
