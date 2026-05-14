"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { SkillBreakdown } from "@/lib/types";

const SkillRadarChart = dynamic(
  () => import("@/components/charts/SkillRadarChart"),
  { ssr: false }
);

type AppRow = {
  id: string;
  github_username: string;
  full_name: string | null;
  email: string | null;
  similarity_score: number | null;
  skill_breakdown: SkillBreakdown | null;
  status: string;
  applied_at: string;
  cover_letter: string | null;
  job?: { title: string; company: string } | null;
};

export default function HRCandidatesPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOn, setFilterOn] = useState(true); // ≥80% filter ON by default
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "date">("score");

  const fetchApps = useCallback(async () => {
    setLoading(true);
    const minSim = filterOn ? 80 : 0;
    const res = await fetch(`/api/applications?min_similarity=${minSim}`);
    if (res.ok) {
      const data = await res.json();
      setApps(data);
    }
    setLoading(false);
  }, [filterOn]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const sorted = [...apps].sort((a, b) => {
    if (sortBy === "score") {
      return (b.similarity_score ?? 0) - (a.similarity_score ?? 0);
    }
    return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
  });

  const updateStatus = async (appId: string, status: string) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="mt-2 text-[#a8a29e]">
          Review applications. Only candidates with ≥80% match are shown by default.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setFilterOn((f) => !f)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            filterOn
              ? "bg-[#e4002b] text-white"
              : "bg-[#111113] text-[#a8a29e] border border-[#ffffff12] hover:border-[#e4002b]/30"
          }`}
        >
          {filterOn ? "🎯 ≥80% Filter ON" : "Show All Candidates"}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "score" | "date")}
          className="px-3 py-2 rounded-lg bg-[#111113] border border-[#ffffff12] text-sm text-[#f2eae3] focus:border-[#e4002b] focus:outline-none"
        >
          <option value="score">Sort by Match %</option>
          <option value="date">Sort by Date</option>
        </select>

        <span className="text-sm text-[#6b6670] ml-auto">
          {sorted.length} candidate{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Candidate List */}
      {loading ? (
        <div className="text-[#a8a29e] text-center py-12">Loading candidates...</div>
      ) : sorted.length === 0 ? (
        <div className="rounded-xl border border-[#ffffff12] bg-[#111113] px-6 py-12 text-center text-[#a8a29e]">
          {filterOn
            ? "No candidates above 80% match threshold. Toggle the filter to see all."
            : "No applications found yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-[#ffffff12] bg-[#111113] overflow-hidden transition-all hover:border-[#ffffff20]"
            >
              {/* Card Header */}
              <button
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
              >
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#e4002b]/10 flex items-center justify-center text-[#e4002b] font-bold text-sm shrink-0">
                  {app.github_username.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f2eae3] truncate">
                      @{app.github_username}
                    </span>
                    {app.full_name && (
                      <span className="text-sm text-[#a8a29e] truncate hidden sm:inline">
                        {app.full_name}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#6b6670] mt-0.5">
                    {app.job?.title && <>{app.job.title} · </>}
                    {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Score Badge */}
                {app.similarity_score != null && (
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                      app.similarity_score >= 80
                        ? "bg-green-500/15 text-green-400 border border-green-500/30"
                        : app.similarity_score >= 50
                        ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {Math.round(app.similarity_score)}%
                  </span>
                )}

                {/* Status */}
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    app.status === "accepted"
                      ? "bg-green-500/15 text-green-400"
                      : app.status === "rejected"
                      ? "bg-red-500/15 text-red-400"
                      : app.status === "reviewed"
                      ? "bg-blue-500/15 text-blue-400"
                      : "bg-[#ffffff08] text-[#a8a29e]"
                  }`}
                >
                  {app.status}
                </span>

                <span className="text-[#6b6670] text-lg">
                  {expanded === app.id ? "▲" : "▼"}
                </span>
              </button>

              {/* Expanded Detail */}
              {expanded === app.id && (
                <div className="border-t border-[#ffffff08] px-5 py-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left: Info */}
                    <div className="space-y-4">
                      {app.email && (
                        <div>
                          <span className="text-[10px] text-[#6b6670] uppercase tracking-wider block">
                            Email
                          </span>
                          <span className="text-sm text-[#f2eae3]">{app.email}</span>
                        </div>
                      )}
                      {app.cover_letter && (
                        <div>
                          <span className="text-[10px] text-[#6b6670] uppercase tracking-wider block mb-1">
                            Cover Letter
                          </span>
                          <p className="text-sm text-[#d8d0ca] leading-relaxed bg-[#0c0c0e] rounded-lg p-3 border border-[#ffffff08]">
                            {app.cover_letter}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => updateStatus(app.id, "reviewed")}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 hover:bg-blue-500/20 transition"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "accepted")}
                          className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20 hover:bg-green-500/20 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20 hover:bg-red-500/20 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {/* Right: Radar Chart */}
                    {app.skill_breakdown && (
                      <div>
                        <span className="text-[10px] text-[#6b6670] uppercase tracking-wider block mb-2">
                          Skill Breakdown
                        </span>
                        <SkillRadarChart data={app.skill_breakdown} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
