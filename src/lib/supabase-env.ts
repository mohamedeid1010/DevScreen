function getProjectRefFromUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

function getProjectRefFromServiceRoleKey(key: string) {
  try {
    const payload = key.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    const decodedPayload = JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf8")) as {
      ref?: unknown;
    };

    return typeof decodedPayload.ref === "string" ? decodedPayload.ref : null;
  } catch {
    return null;
  }
}

function stripWrappingQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, "");
}

function isPlaceholderEnvValue(value: string) {
  const normalized = stripWrappingQuotes(value).trim().toLowerCase();

  return (
    normalized.length === 0 ||
    normalized.startsWith("your_") ||
    normalized.startsWith("replace_") ||
    normalized.includes("placeholder")
  );
}

export function getPublicSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}

export function hasServiceSupabaseEnv() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  return Boolean(
    supabaseUrl &&
      supabaseKey &&
      !isPlaceholderEnvValue(supabaseUrl) &&
      !isPlaceholderEnvValue(supabaseKey),
  );
}

export function getServiceSupabaseEnv() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  if (!hasServiceSupabaseEnv()) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is still set to a placeholder in .env.local");
  }

  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicProjectRef = publicSupabaseUrl ? getProjectRefFromUrl(publicSupabaseUrl) : null;
  const serviceProjectRef = getProjectRefFromServiceRoleKey(supabaseKey) || getProjectRefFromUrl(supabaseUrl);

  if (publicProjectRef && serviceProjectRef && publicProjectRef !== serviceProjectRef) {
    console.warn(
      `[supabase-env] Project mismatch: NEXT_PUBLIC_SUPABASE_URL → ${publicProjectRef}, SUPABASE_SERVICE_ROLE_KEY → ${serviceProjectRef}. Update SUPABASE_SERVICE_ROLE_KEY to the service role key for project ${publicProjectRef}.`
    );
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}