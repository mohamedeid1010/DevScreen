import Link from "next/link";
import { getOptionalSupabase } from "@/services/supabase.service";

export const dynamic = "force-dynamic";

export default async function HRDashboard() {
  const supabase = getOptionalSupabase();

  let totalApps = 0;
  let strongFitCount = 0;
  let avgScore = 0;
  let recentApps: any[] = [];

  if (supabase) {
    try {
      const { data: apps } = await (supabase.from("applications") as any)
        .select("id, github_username, similarity_score, status, applied_at, job:jobs(title)")
        .order("applied_at", { ascending: false })
        .limit(100);

      if (apps) {
        totalApps = apps.length;
        const scores = apps
          .filter((a: any) => a.similarity_score != null)
          .map((a: any) => Number(a.similarity_score));
        strongFitCount = scores.filter((s: number) => s >= 80).length;
        avgScore =
          scores.length > 0
            ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
            : 0;
        recentApps = apps.slice(0, 5);
      }
    } catch {}
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
        <p className="mt-2 text-[#a8a29e]">
          Overview of candidate applications and pipeline metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6">
          <div className="text-sm text-[#a8a29e] uppercase tracking-wider">Total Applications</div>
          <div className="text-3xl font-bold text-[#f2eae3] font-mono mt-2">{totalApps}</div>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-[#111113] p-6">
          <div className="text-sm text-[#a8a29e] uppercase tracking-wider">
            Strong Matches (≥80%)
          </div>
          <div className="text-3xl font-bold text-green-400 font-mono mt-2">{strongFitCount}</div>
        </div>
        <div className="rounded-xl border border-[#e4002b]/20 bg-[#111113] p-6">
          <div className="text-sm text-[#a8a29e] uppercase tracking-wider">Avg Match Score</div>
          <div className="text-3xl font-bold text-[#e4002b] font-mono mt-2">{avgScore}%</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/hr/candidates"
          className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 hover:border-[#e4002b]/30 transition-all group"
        >
          <h3 className="font-semibold text-[#f2eae3] group-hover:text-[#e4002b] transition-colors">
            View Candidates →
          </h3>
          <p className="text-sm text-[#a8a29e] mt-1">
            Review applicants filtered by match score. Only ≥80% shown by default.
          </p>
        </Link>
        <Link
          href="/analyze"
          className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 hover:border-[#e4002b]/30 transition-all group"
        >
          <h3 className="font-semibold text-[#f2eae3] group-hover:text-[#e4002b] transition-colors">
            Run Analysis →
          </h3>
          <p className="text-sm text-[#a8a29e] mt-1">
            Manually analyze any GitHub profile against a job description.
          </p>
        </Link>
      </div>

      {/* Recent Applications */}
      {recentApps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Recent Applications</h2>
          <div className="space-y-2">
            {recentApps.map((app: any) => (
              <div
                key={app.id}
                className="rounded-xl border border-[#ffffff12] bg-[#111113] px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#f2eae3]">@{app.github_username}</span>
                  {app.job?.title && (
                    <span className="text-xs text-[#a8a29e]">→ {app.job.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {app.similarity_score != null && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      app.status === "accepted"
                        ? "bg-green-500/15 text-green-400"
                        : app.status === "rejected"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-[#ffffff08] text-[#a8a29e]"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
