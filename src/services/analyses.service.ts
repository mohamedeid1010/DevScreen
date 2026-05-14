import { getOptionalSupabase, getSupabase, isMissingTableError } from "@/services/supabase.service";
import type { AnalysisResult } from "@/lib/types";

export type StoredAnalysis = {
  id: string;
  user_id: string;
  github_username: string;
  fit_band: string | null;
  match_summary: string | null;
  result: AnalysisResult;
  job_description: string | null;
  analyzed_at: string;
};

export async function getAnalysisByUserId(userId: string): Promise<StoredAnalysis | null> {
  const supabase = getOptionalSupabase();

  if (!supabase) {
    return null;
  }

  const analyses = supabase.from("analyses") as any;

  const { data, error } = await analyses.select("*").eq("user_id", userId).maybeSingle();

  if (error) {
    if (isMissingTableError(error, "analyses")) {
      return null;
    }

    throw error;
  }

  return (data as StoredAnalysis | null) ?? null;
}

export async function saveAnalysisForUser(input: {
  userId: string;
  githubUsername: string;
  result: AnalysisResult;
  jobDescription: string;
}): Promise<void> {
  const supabase = getOptionalSupabase();

  if (!supabase) {
    return;
  }

  const analyses = supabase.from("analyses") as any;

  const row = {
    github_username: input.githubUsername,
    fit_band: input.result.fitBand,
    match_summary: input.result.matchSummary,
    result: input.result,
    job_description: input.jobDescription,
    analyzed_at: new Date().toISOString(),
  };

  const { error } = await analyses.insert([row]);

  if (error) {
    if (isMissingTableError(error, "analyses")) {
      return;
    }

    throw error;
  }
}

export async function getAnalysesForUserIds(userIds: string[]): Promise<Map<string, StoredAnalysis>> {
  if (userIds.length === 0) return new Map();

  const supabase = getOptionalSupabase();

  if (!supabase) {
    return new Map();
  }

  const analyses = supabase.from("analyses") as any;

  const { data, error } = await analyses.select("*").in("user_id", userIds);

  if (error) {
    if (isMissingTableError(error, "analyses")) {
      return new Map();
    }

    throw error;
  }

  const map = new Map<string, StoredAnalysis>();
  for (const row of (data as StoredAnalysis[]) ?? []) {
    map.set(row.user_id, row);
  }
  return map;
}
