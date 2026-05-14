import { getOptionalSupabase } from "@/services/supabase.service";

type StoredAnalysisRow = {
  id: string;
  github_username: string;
  fit_band: string | null;
  match_summary: string | null;
  job_description: string | null;
  analyzed_at: string;
  result: any;
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = getOptionalSupabase();
  let analyses: StoredAnalysisRow[] = [];
  let dbError: string | null = null;

  if (supabase) {
    try {
      const { data, error } = await (supabase.from("analyses") as any)
        .select("*")
        .order("analyzed_at", { ascending: false })
        .limit(50);

      if (error) {
        dbError = error.message;
      } else {
        analyses = (data as StoredAnalysisRow[]) ?? [];
      }
    } catch (err: any) {
      dbError = err.message || "Failed to fetch analyses";
    }
  } else {
    dbError = "Supabase not configured";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        <p className="mt-2 text-[#a8a29e]">
          Past analyses stored in the Supabase{" "}
          <code className="text-[#f2eae3]">analyses</code> table.
        </p>
      </div>

      {dbError && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          Database note: {dbError}
        </div>
      )}

      {analyses.length === 0 && !dbError && (
        <div className="rounded-lg border border-[#ffffff12] bg-[#111113] px-4 py-8 text-center text-[#a8a29e]">
          No analyses found. Run your first analysis from the{" "}
          <a href="/analyze" className="text-[#e4002b] underline">
            Analyze page
          </a>
          .
        </div>
      )}

      {analyses.length > 0 && (
        <div className="space-y-4">
          {analyses.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-[#ffffff12] bg-[#111113] p-5"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-semibold text-[#f2eae3]">
                  @{row.github_username}
                </span>
                {row.fit_band && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.fit_band === "Strong fit"
                        ? "bg-green-500/15 text-green-400 border border-green-500/30"
                        : row.fit_band === "Good fit"
                          ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {row.fit_band}
                  </span>
                )}
                <span className="text-xs text-[#6b6670]">
                  {new Date(row.analyzed_at).toLocaleString()}
                </span>
              </div>
              {row.match_summary && (
                <p className="text-sm text-[#d8d0ca] leading-6 mb-3">
                  {row.match_summary}
                </p>
              )}
              {row.job_description && (
                <details className="text-xs text-[#a8a29e]">
                  <summary className="cursor-pointer hover:text-[#f2eae3] transition">
                    View job description
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap bg-[#0c0c0e] rounded-lg p-3 border border-[#ffffff08]">
                    {row.job_description}
                  </pre>
                </details>
              )}
              {row.result && (
                <details className="text-xs text-[#a8a29e] mt-2">
                  <summary className="cursor-pointer hover:text-[#f2eae3] transition">
                    View full result JSON
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap bg-[#0c0c0e] rounded-lg p-3 border border-[#ffffff08] max-h-60 overflow-y-auto font-mono">
                    {JSON.stringify(row.result, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
