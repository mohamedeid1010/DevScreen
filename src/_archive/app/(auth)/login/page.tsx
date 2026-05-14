import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Radar } from "lucide-react";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeNextPath } from "@/lib/auth-redirect";

type LoginPageProps = Readonly<{
  searchParams: Promise<{ error?: string | string[]; next?: string | string[] }>;
}>;

function getInitialError(errorValue: string | string[] | undefined) {
  const error = Array.isArray(errorValue) ? errorValue[0] : errorValue;
  if (!error) return null;
  return "An error occurred. Please try again.";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const nextPath = normalizeNextPath(query.next);
  
  const cookieStore = await cookies();
  const hasDemoSession = cookieStore.has("demo_github_username");

  if (hasDemoSession) {
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
              Demo Mode
            </div>

            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Enter a GitHub profile to begin.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[#a8a29e] sm:text-lg">
                Recruiter and candidate flows run dynamically using the fetched data from the provided GitHub profile.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Simulated recruiter and candidate views",
                "Live AST and codebase analysis",
                "Automated job fit scoring",
                "Full application workflow demo",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Card className="overflow-hidden rounded-[32px] bg-[#101013]/92">
            <CardHeader className="space-y-2 p-6 pb-0 sm:p-8 sm:pb-0">
              <CardTitle>Start Demo</CardTitle>
              <CardDescription>
                Provide a GitHub URL or username. No real authentication is required for this demo.
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