"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useAuthSession } from "@/components/auth/auth-session-provider";
import { Button } from "@/components/ui/button";
import { getAuthUserDisplayName } from "@/lib/auth-user";
import { cn } from "@/lib/utils";

type AuthControlsProps = Readonly<{
  className?: string;
  loginHref: string;
}>;

export function AuthControls({ className, loginHref }: AuthControlsProps) {
  const { isAuthenticated, user } = useAuthSession();
  const displayName = user ? getAuthUserDisplayName(user) : "Signed in";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {isAuthenticated ? (
        <>
          <span className="inline-flex max-w-[240px] items-center rounded-full border border-[#ffffff12] bg-[#111113] px-3 py-1.5 text-xs text-[#d8d0ca]">
            {displayName}
          </span>

          <form action="/auth/logout" method="post">
            <Button type="submit" size="sm" variant="outline">
              Log out
              <LogOut className="size-4" />
            </Button>
          </form>
        </>
      ) : (
        <Button asChild size="sm">
          <Link href={loginHref}>
            Log in
            <LogIn className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}