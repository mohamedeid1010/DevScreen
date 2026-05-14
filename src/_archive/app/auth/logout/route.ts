import { NextResponse } from "next/server";
import { buildRequestOrigin } from "@/lib/auth-redirect";
import { createClient } from "@/utils/supabase/server";

const GITHUB_OAUTH_COOKIE = "github_provider_token";

export async function POST(request: Request) {
  const origin = buildRequestOrigin(request);
  const supabase = await createClient();

  await supabase.auth.signOut({ scope: "local" });

  const response = NextResponse.redirect(new URL("/login", origin));
  response.cookies.delete(GITHUB_OAUTH_COOKIE);

  return response;
}