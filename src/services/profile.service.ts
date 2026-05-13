import type { User } from "@supabase/supabase-js";
import {
  getAuthUserAvatarUrl,
  getAuthUserDisplayName,
  getAuthUserGitHubLogin,
  getAuthUserMetadataValue,
} from "@/lib/auth-user";
import { getOptionalSupabase, isMissingTableError } from "@/services/supabase.service";

export type ProfileRole = "applicant" | "admin";

export type Profile = {
  id: string;
  email: string | null;
  github_user_id: string | null;
  github_login: string | null;
  display_name: string | null;
  avatar_url: string | null;
  profile_url: string | null;
  auth_provider: string;
  role: ProfileRole;
  metadata: Record<string, unknown>;
  last_sign_in_at: string | null;
  updated_at: string;
};

function buildBaseFields(user: User) {
  const metadata = (user.user_metadata || {}) as Record<string, unknown>;
  const githubLogin = getAuthUserGitHubLogin(user);

  return {
    id: user.id,
    email: user.email ?? null,
    github_user_id: getAuthUserMetadataValue(user, ["provider_id", "sub", "id"]),
    github_login: githubLogin,
    display_name: getAuthUserDisplayName(user),
    avatar_url: getAuthUserAvatarUrl(user),
    profile_url: githubLogin ? `https://github.com/${githubLogin}` : null,
    auth_provider: typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : "github",
    metadata,
    last_sign_in_at: user.last_sign_in_at ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function syncProfileFromAuthUser(user: User): Promise<Profile> {
  const baseFields = buildBaseFields(user);
  const fallback: Profile = { ...baseFields, role: "applicant" };

  const supabase = getOptionalSupabase();

  if (!supabase) {
    return fallback;
  }

  const profilesTable = supabase.from("profiles") as any;

  let existingRole: ProfileRole = "applicant";
  try {
    const { data: existing, error: existingError } = await profilesTable
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      if (isMissingTableError(existingError, "profiles")) {
        return fallback;
      }
      throw existingError;
    }

    if (existing?.role === "admin") {
      existingRole = "admin";
    }
  } catch (err) {
    if (isMissingTableError(err, "profiles")) {
      return fallback;
    }
    throw err;
  }

  const profileRow: Profile = { ...baseFields, role: existingRole };

  const { error } = await profilesTable.upsert([profileRow], { onConflict: "id" });

  if (error) {
    if (isMissingTableError(error, "profiles")) {
      return fallback;
    }
    throw error;
  }

  return profileRow;
}

export async function ensureProfileForAuthUser(user: User): Promise<Profile> {
  const existingProfile = await getProfileById(user.id);

  if (existingProfile) {
    return existingProfile;
  }

  return syncProfileFromAuthUser(user);
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = getOptionalSupabase();

  if (!supabase) {
    return null;
  }

  const profilesTable = supabase.from("profiles") as any;

  const { data, error } = await profilesTable.select("*").eq("id", id).maybeSingle();

  if (error) {
    if (isMissingTableError(error, "profiles")) {
      return null;
    }

    throw error;
  }

  return (data as Profile | null) ?? null;
}

export async function listApplicants(): Promise<Profile[]> {
  const supabase = getOptionalSupabase();

  if (!supabase) {
    return [];
  }

  const profilesTable = supabase.from("profiles") as any;

  const { data, error } = await profilesTable
    .select("*")
    .eq("role", "applicant")
    .order("updated_at", { ascending: false });

  if (error) {
    if (isMissingTableError(error, "profiles")) {
      return [];
    }

    throw error;
  }

  return (data as Profile[]) ?? [];
}
