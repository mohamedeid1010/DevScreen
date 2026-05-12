"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowUpRight, House, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WorkspaceNavItem = {
  href: string;
  label: string;
  caption?: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

type WorkspaceStatus = {
  label: string;
  pulse?: boolean;
  variant?: BadgeVariant;
};

type WorkspaceFrameProps = Readonly<{
  brandHref?: string;
  brandIcon: LucideIcon;
  brandIconClassName?: string;
  brandLabel: string;
  brandTitle: string;
  children: ReactNode;
  headerDescription: string;
  headerEyebrow: string;
  headerStatus: WorkspaceStatus[];
  headerTitle: string;
  navItems: WorkspaceNavItem[];
  spotlightDescription: string;
  spotlightIcon: LucideIcon;
  spotlightLabel: string;
  spotlightTitle: string;
  summaryDescription: string;
  summaryLabel: string;
  summaryValue: string;
  showHeader?: boolean;
  topLinkHref?: string;
  topLinkLabel?: string;
}>;

export function WorkspaceFrame({
  brandHref = "/",
  brandIcon: BrandIcon,
  brandIconClassName,
  brandLabel,
  brandTitle,
  children,
  headerDescription,
  headerEyebrow,
  headerStatus,
  headerTitle,
  navItems,
  spotlightDescription,
  spotlightIcon: SpotlightIcon,
  spotlightLabel,
  spotlightTitle,
  summaryDescription,
  summaryLabel,
  summaryValue,
  showHeader = true,
  topLinkHref = "/",
  topLinkLabel = "Home",
}: WorkspaceFrameProps) {
  const pathname = usePathname();
  const { isReady } = useDemoSession();

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className={cn("lg:sticky lg:self-start", showHeader ? "lg:top-28" : "lg:top-4")}>
          <Card className="animate-rise overflow-hidden bg-[#0c0c0ee0]">
            <div className="h-px bg-gradient-to-r from-transparent via-[#ffffff1f] to-transparent" />
            <CardContent className="space-y-5 p-5 lg:p-6">
              <Link href={brandHref} className="inline-flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-2xl border border-[#ffffff12] bg-[#17171a] text-[#f2eae3] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
                    brandIconClassName
                  )}
                >
                  <BrandIcon className="size-5" />
                </span>
                <span>
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a8a29e]">
                    {brandLabel}
                  </span>
                  <span className="mt-1 block text-base font-semibold text-[#f2eae3]">{brandTitle}</span>
                </span>
              </Link>

              <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">
                  {summaryLabel}
                </p>
                <p className="mt-2 font-mono text-lg font-semibold text-[#ff6568]">
                  {isReady ? summaryValue : "Loading demo"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#a8a29e]">
                  {isReady ? summaryDescription : "Preparing the current demo session for this lane."}
                </p>
              </div>

              <nav className="space-y-2" aria-label={`${brandLabel} navigation`}>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = item.match(pathname);

                  return (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      prefetch
                      transitionTypes={["section-hop"]}
                      className={cn(
                        "group relative flex items-center gap-3 overflow-hidden rounded-[22px] border px-4 py-3 transition duration-300",
                        isActive
                          ? "border-[#e4002b33] bg-[#e4002b0d] text-[#f2eae3] shadow-[0_0_0_1px_rgba(228,0,43,0.14)]"
                          : "border-transparent bg-[#101013] text-[#a8a29e] hover:border-[#ffffff14] hover:bg-[#17171a] hover:text-[#f2eae3]"
                      )}
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-2xl border transition duration-300",
                          isActive
                            ? "border-[#e4002b33] bg-[#e4002b] text-[#fafaf9]"
                            : "border-[#ffffff10] bg-[#09090b] text-[#a8a29e] group-hover:border-[#ffffff18] group-hover:text-[#f2eae3]"
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{item.label}</span>
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "size-4 shrink-0 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                          isActive ? "text-[#ff6568]" : "text-[#a8a29e]/45"
                        )}
                      />
                      {isActive ? (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff6568] to-transparent" />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>

              <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-4">
                <div className="flex items-center gap-2 text-xs text-[#a8a29e]">
                  <SpotlightIcon className="size-3.5 text-[#ff6568]" />
                  {spotlightLabel}
                </div>
                <p className="mt-2 text-sm font-medium text-[#f2eae3]">
                  {isReady ? spotlightTitle : "Loading current focus"}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0 space-y-4">
          {showHeader ? (
            <Card className="sticky top-28 z-10 overflow-hidden bg-[#09090bd9] backdrop-blur-xl">
              <div className="h-px bg-gradient-to-r from-transparent via-[#ffffff18] to-transparent" />
              <CardContent className="flex flex-col gap-4 p-5 lg:p-6">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={topLinkHref}
                      className="inline-flex items-center gap-2 rounded-full border border-[#ffffff12] bg-[#111113] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e] transition hover:border-[#ffffff22] hover:text-[#f2eae3]"
                    >
                      <House className="size-3.5" />
                      {topLinkLabel}
                    </Link>

                    <nav className="flex flex-wrap items-center gap-2" aria-label={`${brandLabel} top navigation`}>
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.match(pathname);

                        return (
                          <Link
                            key={`top-${item.label}-${item.href}`}
                            href={item.href}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition",
                              isActive
                                ? "border-[#e4002b33] bg-[#e4002b0d] text-[#f2eae3]"
                                : "border-[#ffffff12] bg-[#111113] text-[#a8a29e] hover:border-[#ffffff22] hover:text-[#f2eae3]"
                            )}
                          >
                            <Icon className="size-3.5" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 self-start rounded-full border border-[#ffffff12] bg-[#111113] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e] transition hover:border-[#ffffff22] hover:text-[#f2eae3] xl:self-auto"
                  >
                    <LogOut className="size-3.5" />
                    Sign out
                  </Link>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#a8a29e]">
                      {headerEyebrow}
                    </p>
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight text-[#f2eae3] sm:text-[1.9rem]">
                        {headerTitle}
                      </h1>
                      <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#a8a29e]">
                        {isReady ? headerDescription : "Loading the shared demo flow for this lane."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {headerStatus.map((item) => (
                      <Badge key={item.label} variant={item.variant ?? "secondary"} className="px-3.5 py-1.5 text-[11px]">
                        {item.pulse ? <span className="size-1.5 animate-pulse rounded-full bg-current" /> : null}
                        {item.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <main className={cn("space-y-4 pb-10", showHeader ? null : "pt-3 lg:pt-4")}>
            {isReady ? (
              children
            ) : (
              <Card className="bg-[#111113] shadow-none">
                <CardContent className="p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Loading demo session</p>
                  <p className="mt-3 text-base font-medium text-[#f2eae3]">Preparing the active role, featured candidate, and shared story context.</p>
                  <p className="mt-2 text-sm leading-6 text-[#a8a29e]">This keeps deep links from flashing the wrong seeded story before hydration completes.</p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}