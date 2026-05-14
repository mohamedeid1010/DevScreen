"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SkillRadarChart = dynamic(
  () => import("@/components/charts/SkillRadarChart"),
  { ssr: false }
);

const STORAGE_KEY = "devscreen.last-analysis";

type PipelineStage = {
  stage: string;
  message?: string;
  result?: any;
};

const DEFAULT_JOB = `Role: Software Engineer
Seniority: Mid to Senior
Must-have: TypeScript, React, REST/GraphQL APIs, Git workflows
Brief: Build and maintain production web applications. Evaluate code organization, async patterns, testing discipline, and ability to reason about real production code.`;

function AnalyzePageInner() {
  const searchParams = useSearchParams();
  const initialUser = searchParams.get("user") || "";

  const [username, setUsername] = useState(initialUser);
  const [jobDescription, setJobDescription] = useState(DEFAULT_JOB);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load last analysis from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) setResult(parsed.result);
        if (parsed.stages) setStages(parsed.stages);
        if (parsed.username && !initialUser) setUsername(parsed.username);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
      }
    } catch {}
  }, [initialUser]);

  const runAnalysis = useCallback(async () => {
    if (!username.trim() || !jobDescription.trim()) return;

    setIsRunning(true);
    setStages([]);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUsername: username.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Analysis failed");
        setIsRunning(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("No response stream");
        setIsRunning(false);
        return;
      }

      let buffer = "";
      let currentStages: PipelineStage[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event: PipelineStage = JSON.parse(line);
            currentStages.push(event);
            setStages([...currentStages]);

            if (event.stage === "done" && event.result) {
              setResult(event.result);
              // Persist to localStorage
              try {
                localStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify({
                    result: event.result,
                    stages: currentStages,
                    username: username.trim(),
                    jobDescription: jobDescription.trim(),
                    savedAt: new Date().toISOString(),
                  }),
                );
              } catch {}
            }
            if (event.stage === "error") {
              setError(event.message || "Unknown error");
            }
          } catch {
            // skip parse errors
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsRunning(false);
    }
  }, [username, jobDescription]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e4002b]/10 border border-[#e4002b]/20 text-[#e4002b] text-xs font-semibold uppercase tracking-wider mb-2">
          AI-Powered Evaluation
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#f2eae3]">
          Run <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e4002b] to-[#ff4d6d]">Analysis Pipeline</span>
        </h1>
        <p className="text-lg text-[#a8a29e] max-w-2xl mx-auto">
          Enter a GitHub username and job description. The system will run the
          full analysis pipeline and display results in real-time.
        </p>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-[#ffffff12] bg-[#111113]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e4002b] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] relative">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#f2eae3] flex items-center gap-2">
              GitHub Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. torvalds"
              className="w-full h-12 rounded-xl border border-[#ffffff18] bg-[#09090b] px-4 text-[#f2eae3] placeholder:text-[#6b6670] focus:border-[#e4002b] focus:ring-1 focus:ring-[#e4002b] transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#f2eae3]">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-[#ffffff18] bg-[#09090b] px-4 py-3 text-sm text-[#f2eae3] placeholder:text-[#6b6670] focus:border-[#e4002b] focus:ring-1 focus:ring-[#e4002b] transition-all outline-none resize-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end relative">
          <button
            onClick={runAnalysis}
            disabled={isRunning || !username.trim()}
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#e4002b] to-[#ff2a5f] text-white font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(228,0,43,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Running Pipeline...
              </>
            ) : (
              "Initialize Analysis →"
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Progress */}
      {stages.length > 0 && (
        <section className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e4002b] animate-pulse" />
            Pipeline Status
          </h2>
          <div className="rounded-2xl border border-[#ffffff12] bg-[#111113]/80 backdrop-blur-xl p-6 shadow-xl">
            <div className="space-y-3">
              {stages.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-xl border px-5 py-3.5 text-sm transition-all ${
                    s.stage === "error"
                      ? "border-red-500/30 bg-red-500/10 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                      : s.stage === "done"
                        ? "border-green-500/30 bg-green-500/10 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                        : "border-[#ffffff12] bg-[#1a1a1c] text-[#d8d0ca]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    s.stage === "error" ? "bg-red-500/20 text-red-400" :
                    s.stage === "done" ? "bg-green-500/20 text-green-400" :
                    "bg-[#ffffff12] text-[#a8a29e] animate-pulse"
                  }`}>
                    {s.stage === "error" ? "✗" : s.stage === "done" ? "✓" : "⚡"}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs text-[#a8a29e] mb-0.5 tracking-wider uppercase">
                      {s.stage}
                    </div>
                    <div className="font-medium">{s.message || s.stage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {error && !stages.some((s) => s.stage === "error") && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Error: {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between border-b border-[#ffffff12] pb-4">
            <h2 className="text-2xl font-bold">Analysis Report</h2>
            <div className="text-sm text-[#a8a29e]">
              Generated by DevScreen AI
            </div>
          </div>

          {/* GitHub Profile */}
          {result.githubProfile && (
            <div className="rounded-2xl border border-[#ffffff12] bg-gradient-to-br from-[#111113] to-[#1a1a1c] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-8 shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
              {result.githubProfile.avatarUrl && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#e4002b] to-[#ff2a5f] rounded-full blur opacity-20"></div>
                  <img
                    src={result.githubProfile.avatarUrl}
                    alt={`${result.githubProfile.login} avatar`}
                    className="relative w-28 h-28 rounded-full border-2 border-[#ffffff18] object-cover shrink-0"
                  />
                </div>
              )}
              <div className="flex-1 w-full relative">
                <h3 className="text-xs font-bold text-[#e4002b] uppercase tracking-widest mb-4">
                  Candidate Profile
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-6">
                  {result.githubProfile.login && (
                    <div>
                      <span className="text-[#6b6670] block text-[10px] uppercase tracking-widest mb-1.5 font-semibold">
                        Username
                      </span>
                      <span className="text-[#f2eae3] font-bold text-lg">
                        {result.githubProfile.login}
                      </span>
                    </div>
                  )}
                  {result.githubProfile.name && (
                    <div>
                      <span className="text-[#6b6670] block text-[10px] uppercase tracking-widest mb-1.5 font-semibold">
                        Name
                      </span>
                      <span className="text-[#f2eae3] font-bold text-lg">
                        {result.githubProfile.name}
                      </span>
                    </div>
                  )}
                  {result.githubProfile.location && (
                    <div>
                      <span className="text-[#6b6670] block text-[10px] uppercase tracking-widest mb-1.5 font-semibold">
                        Location
                      </span>
                      <span className="text-[#f2eae3] font-medium text-base">
                        {result.githubProfile.location}
                      </span>
                    </div>
                  )}
                  {result.githubProfile.public_repos !== undefined && (
                    <div>
                      <span className="text-[#6b6670] block text-[10px] uppercase tracking-widest mb-1.5 font-semibold">
                        Public Repos
                      </span>
                      <span className="text-[#f2eae3] font-mono font-medium text-lg text-[#e4002b]">
                        {result.githubProfile.public_repos}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fit Band + Summary */}
          <div className="rounded-2xl border border-[#ffffff12] bg-[#111113]/80 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e4002b] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 relative">
              <span
                className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase ${
                  result.fitBand === "Strong fit"
                    ? "bg-green-500/15 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                    : result.fitBand === "Good fit"
                      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                      : "bg-red-500/15 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                }`}
              >
                {result.fitBand}
              </span>
              <div className="h-10 w-px bg-[#ffffff12] hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <span className="text-[#a8a29e] text-sm uppercase tracking-widest font-semibold">AST Complexity Score</span>
                <span className="text-2xl font-black font-mono text-[#f2eae3]">{result.astComplexityScore}</span>
              </div>
            </div>
            <p className="text-[#d8d0ca] leading-relaxed text-lg relative">{result.matchSummary}</p>
          </div>

          {/* Skill Radar Chart */}
          {result.skillBreakdown && (
            <div className="rounded-2xl border border-[#ffffff12] bg-[#111113]/80 backdrop-blur-xl p-8 shadow-xl">
              <h3 className="text-xs font-bold text-[#e4002b] uppercase tracking-widest mb-6 text-center">
                Technical Skill Breakdown
              </h3>
              <SkillRadarChart data={result.skillBreakdown} />
            </div>
          )}

          {/* Strengths + Watchouts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-green-500/20 bg-gradient-to-b from-[#111113] to-green-950/10 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">🎯</span>
                Key Strengths
              </h3>
              <ul className="space-y-4">
                {(result.strengths || []).map((s: string, i: number) => (
                  <li
                    key={i}
                    className="text-[15px] text-[#d8d0ca] flex items-start gap-3 leading-relaxed relative"
                  >
                    <span className="text-green-400 shrink-0 mt-0.5 text-lg">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-b from-[#111113] to-yellow-950/10 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 opacity-[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">⚠️</span>
                Areas of Concern
              </h3>
              <ul className="space-y-4">
                {(result.watchouts || []).map((w: string, i: number) => (
                  <li
                    key={i}
                    className="text-[15px] text-[#d8d0ca] flex items-start gap-3 leading-relaxed relative"
                  >
                    <span className="text-yellow-400 shrink-0 mt-0.5 text-lg">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interview Questions */}
          {result.interviewQuestions?.length > 0 && (
            <div className="rounded-2xl border border-[#ffffff12] bg-[#111113]/80 backdrop-blur-xl p-8 shadow-xl">
              <h3 className="text-xs font-bold text-[#e4002b] uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#e4002b]/10 flex items-center justify-center text-base">💬</span>
                Suggested Interview Questions
              </h3>
              <ol className="space-y-5">
                {result.interviewQuestions.map((q: string, i: number) => (
                  <li
                    key={i}
                    className="text-[15px] text-[#d8d0ca] leading-relaxed flex items-start gap-4 p-4 rounded-xl border border-[#ffffff0a] bg-[#1a1a1c]/50 hover:border-[#e4002b]/30 transition-colors"
                  >
                    <span className="w-6 h-6 rounded bg-[#e4002b]/10 text-[#e4002b] flex items-center justify-center font-mono font-bold shrink-0 text-sm">
                      {i + 1}
                    </span>
                    <span className="mt-0.5">{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="text-[#a8a29e]">Loading...</div>}>
      <AnalyzePageInner />
    </Suspense>
  );
}
