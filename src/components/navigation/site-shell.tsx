"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  House,
  LogIn,
  Radar,
  UserRoundSearch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DemoSessionProvider, useDemoSession } from "@/components/demo/demo-session-provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

type PrimaryNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  description: string;
  match: (pathname: string) => boolean;
};

const primaryNavItems: PrimaryNavItem[] = [
  {
    href: "/",
    label: "Mission Control",
    shortLabel: "Home",
    icon: House,
    description: "Start here, then open a lane.",
    match: (pathname) => pathname === "/",
  },
  {
    href: "/candidate",
    label: "Candidate Lane",
    shortLabel: "Candidate",
    icon: UserRoundSearch,
    description: "Read the candidate story.",
    match: (pathname) => pathname.startsWith("/candidate"),
  },
  {
    href: "/login",
    label: "Secure Access",
    shortLabel: "Access",
    icon: LogIn,
    description: "Preview the access flow.",
    match: (pathname) => pathname === "/login" || pathname === "/callback",
  },
];

function GlobalNavLink({ item, pathname }: { item: PrimaryNavItem; pathname: string }) {
  const Icon = item.icon;
  const isActive = item.match(pathname);

  return (
    <Link
      href={item.href}
      prefetch
      transitionTypes={["section-hop"]}
      className={cn(
        "group relative flex items-center gap-2.5 overflow-hidden rounded-2xl border px-3.5 py-2 text-left transition duration-300",
        isActive
          ? "border-[#e4002b33] bg-[#e4002b0d] text-[#f2eae3] shadow-[0_0_0_1px_rgba(228,0,43,0.14)]"
          : "border-transparent bg-transparent text-[#a8a29e] hover:border-[#ffffff12] hover:bg-[#17171a] hover:text-[#f2eae3]"
      )}
    >
      <div
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-2xl border transition duration-300",
          isActive
            ? "border-[#e4002b33] bg-[#e4002b] text-[#fafaf9]"
            : "border-[#ffffff10] bg-[#111113] text-[#a8a29e] group-hover:border-[#ffffff18] group-hover:text-[#f2eae3]"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{item.shortLabel}</p>
        <p className="hidden text-[11px] text-[#a8a29e] xl:block">{item.label}</p>
      </div>
      {isActive ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff6568] to-transparent" />
      ) : null}
    </Link>
  );
}

function MobileDockLink({ item, pathname }: { item: PrimaryNavItem; pathname: string }) {
  const Icon = item.icon;
  const isActive = item.match(pathname);

  return (
    <Link
      href={item.href}
      prefetch
      transitionTypes={["section-hop"]}
      className={cn(
        "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition duration-300",
        isActive ? "bg-[#e4002b] text-[#fafaf9]" : "text-[#a8a29e] hover:bg-[#17171a] hover:text-[#f2eae3]"
      )}
    >
      <Icon className="size-4" />
      <span>{item.shortLabel}</span>
    </Link>
  );
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <DemoSessionProvider>
      <SiteShellFrame>{children}</SiteShellFrame>
    </DemoSessionProvider>
  );
}

function SiteShellFrame({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isRecruiterSite = pathname.startsWith("/recruiter");
  const activeItem = primaryNavItems.find((item) => item.match(pathname)) ?? primaryNavItems[0];
  const { isReady, session } = useDemoSession();
  const isCandidateSiteView = pathname.startsWith("/candidate");
  const currentRoleLabel = isCandidateSiteView ? (isReady ? session.job.title : "Loading demo") : "Shared demo";

  if (isRecruiterSite) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1520px]">
          <Card className="overflow-hidden rounded-[30px] border-[#ffffff12] bg-[#0a0a0dcc]/85 shadow-[0_22px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl">
            <div key={pathname} className="route-progress-bar h-px bg-[#ffffff08]">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-[#ff6568] to-transparent" />
            </div>

            <div className="flex flex-col gap-3 px-4 py-3 lg:px-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-4">
                  <Link
                    href="/"
                    prefetch
                    transitionTypes={["section-hop"]}
                    className="inline-flex items-center gap-3"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#e4002b33] bg-[#e4002b] text-[#fafaf9]">
                      <Radar className="size-5" />
                    </span>
                    <span>
                      <span className="block text-[1.02rem] font-semibold leading-none tracking-[-0.04em] text-[#f2eae3] sm:text-[1.08rem]">
                        DevScreen
                      </span>
                      <span className="mt-1 hidden text-[11px] text-[#a8a29e] sm:block">Simple hiring demo</span>
                    </span>
                  </Link>

                  <div className="hidden min-[980px]:block">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="success" className="px-3 py-1.5 text-[10px]">
                        Demo Mode
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1.5 text-[10px]">
                        {activeItem.label}
                      </Badge>
                      <Badge variant="neutral" className="px-3 py-1.5 text-[10px]">
                        {currentRoleLabel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <nav className="hidden flex-wrap items-center gap-2 lg:flex" aria-label="Global navigation">
                  {primaryNavItems.map((item) => (
                    <GlobalNavLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </nav>
              </div>
            </div>
          </Card>
        </div>
      </header>

      <nav className="fixed inset-x-4 bottom-4 z-50 md:hidden" aria-label="Mobile navigation">
        <Card className="mx-auto max-w-md rounded-[28px] border-[#ffffff12] bg-[#0a0a0ddc] p-2 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${primaryNavItems.length}, minmax(0, 1fr))` }}>
            {primaryNavItems.map((item) => (
              <MobileDockLink key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        </Card>
      </nav>

      <div className="pb-28 pt-36 md:pb-8 md:pt-32">
        <div key={pathname} className="route-stage">
          {children}
        </div>
      </div>
    </div>
  );
}