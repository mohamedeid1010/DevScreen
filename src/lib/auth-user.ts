import type { User } from "@supabase/supabase-js";

type AuthUserMetadata = Record<string, unknown>;

function toNullableString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function getUserMetadata(user: User): AuthUserMetadata {
  return (user.user_metadata || {}) as AuthUserMetadata;
}

function getFirstMetadataValue(metadata: AuthUserMetadata, keys: string[]) {
  for (const key of keys) {
    const value = toNullableString(metadata[key]);

    if (value) {
      return value;
    }
  }

  return null;
}

export function getAuthUserGitHubLogin(user: User) {
  return getFirstMetadataValue(getUserMetadata(user), ["preferred_username", "user_name", "login", "nickname"]);
}

export function getAuthUserDisplayName(user: User) {
  const metadata = getUserMetadata(user);

  return (
    getFirstMetadataValue(metadata, ["full_name", "name", "user_name", "preferred_username", "login", "nickname"])
    || user.email
    || "Signed in"
  );
}

export function getAuthUserAvatarUrl(user: User) {
  return getFirstMetadataValue(getUserMetadata(user), ["avatar_url", "picture"]);
}

export function getAuthUserMetadataValue(user: User, keys: string[]) {
  return getFirstMetadataValue(getUserMetadata(user), keys);
}