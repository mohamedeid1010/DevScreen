import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/lib/supabase-env";

export const createClient = () => {
  const { supabaseUrl, supabaseKey } = getPublicSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabaseKey);
};