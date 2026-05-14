import { type NextRequest, NextResponse } from "next/server";
import { buildRequestOrigin, normalizeNextPath } from "@/lib/auth-redirect";
import { createClient } from "@/utils/supabase/server";

function getOAuthStartErrorCode(message: string | undefined) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (normalizedMessage.includes("unsupported provider") || normalizedMessage.includes("provider is not enabled")) {
    return "oauth_provider_disabled";
  }

  if (normalizedMessage.includes("redirect") && (normalizedMessage.includes("allow") || normalizedMessage.includes("whitelist"))) {
    return "oauth_redirect_not_allowed";
  }

  if (
    normalizedMessage.includes("provider")
    && (normalizedMessage.includes("client") || normalizedMessage.includes("secret") || normalizedMessage.includes("credential"))
  ) {
    return "oauth_provider_misconfigured";
  }

  return "oauth_start_failed";
}

export async function GET(request: NextRequest) {
  const nextPath = normalizeNextPath(new URL(request.url).searchParams.get("next"));
  const origin = buildRequestOrigin(request);
  const callbackUrl = new URL("/callback", origin);
  callbackUrl.searchParams.set("next", nextPath);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error || !data.url) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", getOAuthStartErrorCode(error?.message));
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(data.url);
}