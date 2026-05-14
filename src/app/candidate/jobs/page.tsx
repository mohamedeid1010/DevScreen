import Link from "next/link";
import { getOptionalSupabase } from "@/services/supabase.service";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

const SENIORITY_COLORS: Record<string, string> = {
  Senior: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Mid-Senior": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Mid: "bg-green-500/15 text-green-400 border-green-500/30",
  Junior: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Intern: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default async function CandidateJobsPage() {
  const supabase = getOptionalSupabase();
  let jobs: Job[] = [];

  if (supabase) {
    try {
      const { data } = await (supabase.from("jobs") as any)
        .select("*")
        .order("created_at", { ascending: false });
      jobs = (data as Job[]) ?? [];
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Open Positions</h1>
        <p className="mt-2 text-[#a8a29e]">
          Browse available jobs and internships. Click to see details and apply.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-[#ffffff12] bg-[#111113] px-6 py-12 text-center text-[#a8a29e]">
          No open positions at the moment. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/candidate/jobs/${job.id}`}
              className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 hover:border-[#e4002b]/30 transition-all group block"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#f2eae3] group-hover:text-[#e4002b] transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[#a8a29e]">
                    {job.location && <span>{job.location}</span>}
                    {job.hiring_manager && (
                      <>
                        <span>·</span>
                        <span>Hiring: {job.hiring_manager}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.seniority && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        SENIORITY_COLORS[job.seniority] || SENIORITY_COLORS["Mid"]
                      }`}
                    >
                      {job.seniority}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#d8d0ca] leading-relaxed line-clamp-2">
                {job.role_brief}
              </p>
              {job.must_have_tech && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.must_have_tech.split(",").slice(0, 5).map((tech) => (
                    <span
                      key={tech.trim()}
                      className="px-2 py-0.5 rounded bg-[#ffffff08] text-[10px] text-[#a8a29e]"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
