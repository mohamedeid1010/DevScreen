import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Radar } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeNextPath } from "@/lib/auth-redirect";
import { createClient } from "@/utils/supabase/server";

type LoginPageProps = Readonly<{
  searchParams: Promise<{ error?: string | string[]; next?: string | string[] }>;
}>;

function getInitialError(errorValue: string | string[] | undefined) {
  const error = Array.isArray(errorValue) ? errorValue[0] : errorValue;

  if (error === "auth_callback_failed") {
    return "We couldn't finish the auth redirect. Please try signing in again.";
  }

  if (error === "oauth_provider_disabled") {
    return "GitHub login is disabled in Supabase. Enable the GitHub provider and save a client ID/client secret, then try again.";
  }

  if (error === "oauth_redirect_not_allowed") {
    return "Supabase blocked this redirect URL. Add this app's /callback URL to the Auth redirect allow list, then try again.";
  }

  if (error === "oauth_provider_misconfigured") {
    return "Supabase GitHub credentials look incomplete. Check the GitHub client ID and secret in Supabase, then try again.";
  }

  if (error === "oauth_start_failed") {
    return "We couldn't start the GitHub login flow. Check the Supabase GitHub provider setup and try again.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const nextPath = normalizeNextPath(query.next);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (!error && data?.claims?.sub) {
    redirect(nextPath);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] px-6 py-10 text-[#f2eae3] sm:px-10 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(228,0,43,0.08),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#a8a29e] transition hover:text-[#f2eae3]">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#e4002b33] bg-[#e4002b0d] px-4 py-2 font-mono text-xs text-[#ff6568]">
              <Radar className="size-3.5" />
              Supabase Auth
            </div>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Sign in before opening the live lanes.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[#a8a29e] sm:text-lg">
                Recruiter and candidate flows now run behind real Supabase sessions instead of the old open demo navigation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Protected recruiter and candidate routes",
                "Session refresh handled at the proxy boundary",
                "Same visual demo flow, but with real login state",
                "Post-login redirect keeps the lane you requested",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Card className="overflow-hidden rounded-[32px] bg-[#101013]/92">
            <CardHeader className="space-y-2 p-6 pb-0 sm:p-8 sm:pb-0">
              <CardTitle>Account login</CardTitle>
              <CardDescription>
                Sign in with GitHub through Supabase Auth only. Email and password login has been removed from this app.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <LoginForm nextPath={nextPath} initialError={getInitialError(query.error)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}