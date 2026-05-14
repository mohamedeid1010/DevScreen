import { GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitGithubLink } from "@/app/(auth)/login/actions";

type LoginFormProps = Readonly<{
  nextPath: string;
  initialError?: string | null;
}>;

export function LoginForm({ nextPath, initialError = null }: LoginFormProps) {
  return (
    <div className="space-y-4">
      <form action={submitGithubLink} className="space-y-3 rounded-2xl border border-[#ffffff12] bg-[#111113] p-4">
        <div>
          <p className="text-sm font-medium text-[#f2eae3]">Enter GitHub Profile</p>
          <p className="mt-1 text-sm leading-6 text-[#a8a29e]">
            Provide a GitHub profile link or username to begin the demo analysis.
          </p>
        </div>

        <input
          type="text"
          name="github_url"
          required
          placeholder="https://github.com/username"
          className="h-12 w-full rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] px-4 text-[#f2eae3] placeholder:text-[#a8a29e] focus:border-[#ff6568] focus:outline-none"
        />

        <Button type="submit" size="lg" className="h-12 w-full rounded-2xl bg-[#e4002b] text-[#fafaf9] hover:bg-[#e4002b]/90">
          Start Demo
          <GitBranch className="ml-2 size-4" />
        </Button>
      </form>

      {initialError ? (
        <div className="rounded-2xl border border-[#ff656833] bg-[#e4002b12] px-4 py-3 text-sm text-[#ffb4b6]">
          {initialError}
        </div>
      ) : null}
    </div>
  );
}