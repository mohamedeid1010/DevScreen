"use client";

import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Button } from "@/components/ui/button";

export function RecruiterOverviewActions() {
  const { matchesHref, session } = useDemoSession();

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-12 rounded-2xl px-6">
          <Link href="/recruiter/jobs/new">
            Create new role
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-2xl border-[#ffffff14] bg-[#0f0f12] px-6 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
        >
          <Link href={matchesHref}>
            Open current demo matches
            <UsersRound className="size-4" />
          </Link>
        </Button>
      </div>
      <p className="text-sm text-[#a8a29e]">Current role: {session.job.title}</p>
    </div>
  );
}