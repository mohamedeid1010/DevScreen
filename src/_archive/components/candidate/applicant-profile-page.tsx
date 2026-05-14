"use client";

import { useState } from "react";
import { GitBranch, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type AnalysisResult } from "@/lib/types";

type ApplicantProfilePageProps = {
  applicantName: string;
  githubLogin: string | null;
  avatarUrl: string | null;
  email: string | null;
  initialAnalysis: AnalysisResult | null;
  defaultJobDescription: string;
};

type ProgressStage = "idle" | "github" | "embeddings" | "insights" | "done";

type AnalyzeStreamEvent =
  | { stage: "github" | "embeddings" | "insights" }
  | { stage: "done"; result: AnalysisResult }
  | { stage: "error"; message: string };

function fitBandColors(fitBand: string | null) {
  if (fitBand === "Strong fit") {
    return "border-[#3af28d33] bg-[#3af28d12] text-[#7af7aa]";
  }
  if (fitBand === "Good fit") {
    return "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]";
  }
  if (fitBand === "Poor fit") {
    return "border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568]";
  }
  return "border-[#ffffff12] bg-[#ffffff08] text-[#a8a29e]";
}

export function ApplicantProfilePage({
  applicantName,
  githubLogin,
  avatarUrl,
  email,
  initialAnalysis,
  defaultJobDescription,
}: ApplicantProfilePageProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(initialAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStage, setProgressStage] = useState<ProgressStage>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setProgressStage("github");
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: defaultJobDescription }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message = `Analysis failed with status ${res.status}`;
        try {
          const parsed = JSON.parse(errorText) as { error?: string };
          message = parsed.error || message;
        } catch {
          message = errorText || message;
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
          setAnalysis(event.result);
          return true;
        }
        setProgressStage(event.stage);
        return false;
      };

      while (!shouldStop) {
        const { value, done } = await reader.read();
        if (value) buffer += decoder.decode(value, { stream: true });
        if (done) buffer += decoder.decode();

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const event = JSON.parse(trimmed) as AnalyzeStreamEvent;
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
      setError(err.message || "Analysis failed");
      setProgressStage("idle");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeButtonLabel = !isAnalyzing
    ? analysis ? "Re-run analysis" : "Run analysis"
    : progressStage === "github"
      ? "Fetching GitHub data..."
      : progressStage === "embeddings"
        ? "Analyzing code..."
        : progressStage === "insights"
          ? "Generating insights..."
          : "Running...";

  return (
    <div className="space-y-4">
      <Card className="bg-[#111113]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={applicantName}
                  className="size-16 rounded-2xl border border-[#ffffff12]"
                />
              ) : (
                <div className="grid size-16 place-items-center rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] font-mono text-lg text-[#f2eae3]">
                  {applicantName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#a8a29e]">Your applicant profile</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#f2eae3]">{applicantName}</h1>
                {githubLogin ? (
                  <a
                    href={`https://github.com/${githubLogin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-[#a8a29e] hover:text-[#f2eae3]"
                  >
                    <GitBranch className="size-3.5" />
                    github.com/{githubLogin}
                  </a>
                ) : null}
                {email ? <p className="mt-1 text-xs text-[#a8a29e]">{email}</p> : null}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {analysis ? (
                <span className={`rounded-full border px-3 py-1.5 font-mono text-xs ${fitBandColors(analysis.fitBand)}`}>
                  {analysis.fitBand}
                </span>
              ) : null}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !githubLogin}
                className="h-11 rounded-xl px-5 bg-[#f99c00] text-black hover:bg-[#f99c00]/90"
              >
                {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {analyzeButtonLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="border-[#e4002b33] bg-[#e4002b0d]">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-widest text-[#ff6568]/80">Error</p>
              <p className="mt-1 text-sm leading-6 text-[#ff6568]">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568] hover:bg-[#e4002b1a]"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </CardContent>
        </Card>
      ) : null}

      {!githubLogin ? (
        <Card className="border-[#f99c001a] bg-[#f99c000d]">
          <CardContent className="p-5 text-sm text-[#f99c00]">
            Your account has no GitHub username attached. Sign out and sign back in with GitHub OAuth.
          </CardContent>
        </Card>
      ) : null}

      {!analysis && !isAnalyzing ? (
        <Card className="bg-[#111113]">
          <CardContent className="p-8 text-center">
            <Sparkles className="mx-auto size-8 text-[#f99c00]" />
            <h2 className="mt-4 text-xl font-semibold text-[#f2eae3]">No analysis yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#a8a29e]">
              Run the analysis to generate your fit band, strengths, watchouts, and the interview questions recruiters will see.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {analysis ? <AnalysisDetails analysis={analysis} /> : null}
    </div>
  );
}

function AnalysisDetails({ analysis }: { analysis: AnalysisResult }) {
  const strengths = analysis.strengths ?? [];
  const watchouts = analysis.watchouts ?? [];
  const interviewQuestions = analysis.interviewQuestions ?? [];
  const topCodeChunks = analysis.topCodeChunks ?? [];

  return (
    <div className="space-y-4">
      <Card className="bg-[#111113]">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 font-mono text-xs ${fitBandColors(analysis.fitBand)}`}>
              {analysis.fitBand}
            </span>
            <span className="rounded-full border border-[#ffffff12] bg-[#ffffff08] px-3 py-1 font-mono text-xs text-[#a8a29e]">
              Complexity {analysis.astComplexityScore}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#f2eae3]">Match summary</h2>
          <p className="mt-2 text-sm leading-7 text-[#a8a29e]">{analysis.matchSummary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-[#111113]">
          <CardContent className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#00bb7f]/70">Strengths</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {strengths.length === 0 ? (
                <p className="text-sm text-[#a8a29e]">None returned.</p>
              ) : strengths.map((s) => (
                <span key={s} className="rounded-full border border-[#00bb7f1a] bg-[#00bb7f0f] px-3 py-1.5 text-xs text-[#7ef0c8]">
                  {s}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111113]">
          <CardContent className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#f99c00]/70">Watchouts</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {watchouts.length === 0 ? (
                <p className="text-sm text-[#a8a29e]">None returned.</p>
              ) : watchouts.map((w) => (
                <span key={w} className="rounded-full border border-[#f99c001a] bg-[#f99c000d] px-3 py-1.5 text-xs text-[#f99c00]">
                  {w}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {topCodeChunks.length > 0 ? (
        <Card className="bg-[#111113]">
          <CardContent className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8a29e]">Top matched code</p>
            <div className="mt-3 space-y-3">
              {topCodeChunks.slice(0, 5).map((chunk, i) => (
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

      {interviewQuestions.length > 0 ? (
        <Card className="bg-[#111113]">
          <CardContent className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8a29e]">Interview prompts</p>
            <ul className="mt-3 space-y-3">
              {interviewQuestions.map((q, i) => (
                <li key={i} className="border-l-2 border-[#f99c00] pl-3 text-sm leading-6 text-[#a8a29e]">
                  <span className="font-mono text-xs text-[#f99c00]">Q{i + 1}.</span> {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
