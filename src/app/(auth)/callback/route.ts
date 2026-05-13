import { type NextRequest, NextResponse } from "next/server";
import { buildRequestOrigin, normalizeNextPath } from "@/lib/auth-redirect";
import { syncProfileFromAuthUser } from "@/services/profile.service";
import { createClient } from "@/utils/supabase/server";

const GITHUB_OAUTH_COOKIE = "github_provider_token";
const GITHUB_OAUTH_COOKIE_MAX_AGE_SECONDS = 55 * 60;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const explicitNext = normalizeNextPath(requestUrl.searchParams.get("next"), "/candidate");
  const origin = buildRequestOrigin(request);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!userError && userData.user) {
        try {
          await syncProfileFromAuthUser(userData.user);
        } catch (profileSyncError) {
          console.error("Failed to sync Supabase profile after GitHub login", profileSyncError);
        }

        const target = explicitNext.startsWith("/candidate") ? explicitNext : "/candidate";
        const response = NextResponse.redirect(new URL(target, origin));
        const githubProviderToken = data.session?.provider_token?.trim();

        if (githubProviderToken) {
          response.cookies.set(GITHUB_OAUTH_COOKIE, githubProviderToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            maxAge: GITHUB_OAUTH_COOKIE_MAX_AGE_SECONDS,
          });
        }

        return response;
      }
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  loginUrl.searchParams.set("next", explicitNext);
  return NextResponse.redirect(loginUrl);
}
