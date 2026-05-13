import Link from "next/link";
import { GitBranch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoginFormProps = Readonly<{
  nextPath: string;
  initialError?: string | null;
}>;

export function LoginForm({ nextPath, initialError = null }: LoginFormProps) {
  const githubHref = `/auth/github?next=${encodeURIComponent(nextPath)}`;

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl border border-[#ffffff12] bg-[#111113] p-4">
        <div>
          <p className="text-sm font-medium text-[#f2eae3]">Continue with GitHub only</p>
          <p className="mt-1 text-sm leading-6 text-[#a8a29e]">
            Login is handled with GitHub OAuth through Supabase on the backend, then returned to {nextPath}.
          </p>
        </div>

        <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-2xl border-[#ffffff12] bg-[#0c0c0e] text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
          <Link href={githubHref}>
            Continue with GitHub
            <GitBranch className="size-4" />
          </Link>
        </Button>
      </div>

      {initialError ? (
        <div className="rounded-2xl border border-[#ff656833] bg-[#e4002b12] px-4 py-3 text-sm text-[#ffb4b6]">
          {initialError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
        <div className="flex items-center gap-2 text-[#f2eae3]">
          <ShieldCheck className="size-4 text-[#ff6568]" />
          Supabase Auth session
        </div>
        <p className="mt-2">
          GitHub is now the only sign-in path. Supabase session handling starts on the server, not from a frontend auth form.
        </p>
      </div>
    </div>
  );
}