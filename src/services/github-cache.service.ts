/*
create table if not exists github_profile_cache (
  username text primary key,
  data jsonb not null,
  fetched_at timestamptz not null default now()
);
*/

import { getOptionalSupabase, isMissingTableError } from "./supabase.service";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type GitHubProfileCacheRow = {
  username: string;
  data: any;
  fetched_at: string;
};

export async function getCachedProfile(username: string): Promise<GitHubProfileCacheRow | null> {
  const supabase = getOptionalSupabase();
  if (!supabase) return null;

  const cacheTable = supabase.from("github_profile_cache") as any;
  const { data, error } = await cacheTable
    .select("username, data, fetched_at")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error, "github_profile_cache")) {
      return null;
    }
    throw error;
  }

  if (!data?.fetched_at) {
    return null;
  }

  const fetchedAt = new Date(data.fetched_at).getTime();

  if (Number.isNaN(fetchedAt) || Date.now() - fetchedAt >= CACHE_TTL_MS) {
    return null;
  }

  return data as GitHubProfileCacheRow;
}

export async function setCachedProfile(username: string, data: any) {
  const supabase = getOptionalSupabase();
  if (!supabase) return;

  const cacheTable = supabase.from("github_profile_cache") as any;
  const { error } = await cacheTable.upsert(
    [{
      username,
      data,
      fetched_at: new Date().toISOString(),
    }],
    { onConflict: "username" }
  );

  if (error) {
    if (isMissingTableError(error, "github_profile_cache")) {
      return;
    }
    throw error;
  }
}
