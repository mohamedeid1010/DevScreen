import { createClient } from "@supabase/supabase-js";
import { getServiceSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/supabase-env";

let supabase: ReturnType<typeof createClient> | null = null;

type SupabaseQueryErrorLike = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

export function getSupabase() {
  if (supabase) {
    return supabase;
  }

  const { supabaseUrl, supabaseKey } = getServiceSupabaseEnv();

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

export function getOptionalSupabase() {
  if (!hasServiceSupabaseEnv()) {
    return null;
  }

  return getSupabase();
}

export function isMissingTableError(error: unknown, tableName: string) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const { code, message, details, hint } = error as SupabaseQueryErrorLike;
  const text = [message, details, hint]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  const normalizedTableName = tableName.toLowerCase();

  return (
    code === "42P01" ||
    (code === "PGRST205" && text.includes(normalizedTableName)) ||
    (text.includes(normalizedTableName) &&
      (text.includes("does not exist") || text.includes("could not find the table")))
  );
}