"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Check,
  ChevronDown,
  Download,
  Filter,
  LoaderCircle,
} from "lucide-react";
import { ActivityFeed } from "./activity-feed";
import { InsightsCard } from "./insights-card";
import { JobsTable } from "./jobs-table";
import { KpiCard } from "./kpi-card";
import { MatchDistribution } from "./match-distribution";
import {
  getAnalyticsSnapshot,
  REGION_FILTER_OPTIONS,
  ROLE_FILTER_OPTIONS,
  SENIORITY_FILTER_OPTIONS,
  type RegionFilter,
  type RoleFilter,
  type SeniorityFilter,
  type TimeRange,
} from "./mock-data";
import { PipelineFunnel } from "./pipeline-funnel";
import { SkillRadar } from "./skill-radar";
import { SkillTreemap } from "./skill-treemap";
import { TimeRangeTabs } from "./time-range-tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnalyticsDashboardProps = {
  initialTimestamp: string;
};

export function AnalyticsDashboard({ initialTimestamp }: AnalyticsDashboardProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={120} skipDelayDuration={80}>
        <AnalyticsDashboardContent initialTimestamp={initialTimestamp} />
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}

type FiltersDropdownProps = {
  regionFilter: RegionFilter;
  roleFilter: RoleFilter;
  seniorityFilter: SeniorityFilter;
  setRegionFilter: (value: RegionFilter) => void;
  setRoleFilter: (value: RoleFilter) => void;
  setSeniorityFilter: (value: SeniorityFilter) => void;
};

type ExportPopoverProps = {
  exportFormat: string;
  setExportFormat: (value: string) => void;
};

function FiltersDropdown({
  regionFilter,
  roleFilter,
  seniorityFilter,
  setRegionFilter,
  setRoleFilter,
  setSeniorityFilter,
}: FiltersDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="h-11 rounded-2xl border-[#ffffff12] bg-[#111113] px-4 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
          <Filter className="size-4" />
          Filters
          <ChevronDown className="size-4 text-[#a8a29e]" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 min-w-[280px] rounded-2xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-2 shadow-2xl backdrop-blur data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95" sideOffset={8}>
          <div className="px-2 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8a29e]">Role</p>
          </div>
          <DropdownMenu.RadioGroup value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
            {ROLE_FILTER_OPTIONS.map((option) => (
              <DropdownMenu.RadioItem key={option} value={option} className="relative flex cursor-default items-center rounded-xl px-9 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a]">
                {option}
                <DropdownMenu.ItemIndicator className="absolute left-3 inline-flex items-center">
                  <Check className="size-4 text-[#f99c00]" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator className="my-2 h-px bg-[#ffffff0a]" />

          <div className="px-2 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8a29e]">Seniority</p>
          </div>
          <DropdownMenu.RadioGroup value={seniorityFilter} onValueChange={(value) => setSeniorityFilter(value as SeniorityFilter)}>
            {SENIORITY_FILTER_OPTIONS.map((option) => (
              <DropdownMenu.RadioItem key={option} value={option} className="relative flex cursor-default items-center rounded-xl px-9 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a]">
                {option}
                <DropdownMenu.ItemIndicator className="absolute left-3 inline-flex items-center">
                  <Check className="size-4 text-[#f99c00]" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator className="my-2 h-px bg-[#ffffff0a]" />

          <div className="px-2 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8a29e]">Region</p>
          </div>
          <DropdownMenu.RadioGroup value={regionFilter} onValueChange={(value) => setRegionFilter(value as RegionFilter)}>
            {REGION_FILTER_OPTIONS.map((option) => (
              <DropdownMenu.RadioItem key={option} value={option} className="relative flex cursor-default items-center rounded-xl px-9 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a]">
                {option}
                <DropdownMenu.ItemIndicator className="absolute left-3 inline-flex items-center">
                  <Check className="size-4 text-[#f99c00]" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function ExportPopover({ exportFormat, setExportFormat }: ExportPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button className="h-11 rounded-2xl px-4 shadow-[0_0_30px_rgba(249,156,0,0.15)]">
          <Download className="size-4" />
          Export
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="z-50 w-[300px] rounded-2xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-4 shadow-2xl backdrop-blur data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95" sideOffset={10} align="end">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8a29e]">Export format</p>
          <p className="mt-2 text-sm leading-6 text-[#a8a29e]">Prepare a recruiter-ready analytics snapshot without leaving the dashboard.</p>

          <div className="mt-4">
            <Select.Root value={exportFormat} onValueChange={setExportFormat}>
              <Select.Trigger className="inline-flex h-11 w-full items-center justify-between rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 text-sm text-[#f2eae3] outline-none transition hover:border-[#ffffff1a] focus-visible:ring-2 focus-visible:ring-[#f99c00]">
                <Select.Value />
                <Select.Icon>
                  <ChevronDown className="size-4 text-[#a8a29e]" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-2xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-1 shadow-2xl backdrop-blur data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
                  <Select.Viewport className="space-y-1 p-1">
                    {[
                      { label: "CSV snapshot", value: "csv" },
                      { label: "JSON payload", value: "json" },
                      { label: "PDF summary", value: "pdf" },
                    ].map((option) => (
                      <Select.Item key={option.value} value={option.value} className="relative flex cursor-default items-center rounded-xl px-9 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a]">
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-3 inline-flex items-center">
                          <Check className="size-4 text-[#f99c00]" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <Button className="mt-4 h-11 w-full rounded-xl">Prepare export</Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function AnalyticsLoadingState() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[210px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113]" />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-12">
        <div className="h-[520px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113] lg:col-span-7" />
        <div className="h-[520px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113] lg:col-span-5" />
      </section>

      <div className="h-[420px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113]" />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="h-[430px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113]" />
        <div className="h-[430px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113]" />
      </section>

      <div className="h-[420px] animate-pulse rounded-2xl border border-[#ffffff12] bg-[#111113]" />
      <div className="h-[280px] animate-pulse rounded-2xl border border-[#ac4bff33] bg-[#111113]" />
    </div>
  );
}

type EmptyFilterStateProps = {
  title: string;
  className?: string;
  onClearFilters: () => void;
};

function EmptyFilterState({ title, className, onClearFilters }: EmptyFilterStateProps) {
  return (
    <section className={cn("animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] lg:p-6", className)}>
      <div className="rounded-2xl border border-dashed border-[#ffffff12] bg-[#0c0c0e] px-5 py-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">{title}</p>
        <p className="mt-3 text-sm leading-6 text-[#a8a29e]">
          No results match the current filters. Adjust filters or clear them.
        </p>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="h-10 rounded-xl border-[#ffffff12] bg-[#111113] px-4 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]" onClick={onClearFilters}>
            Clear filters
          </Button>
        </div>
      </div>
    </section>
  );
}

function AnalyticsDashboardContent({ initialTimestamp }: AnalyticsDashboardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState(initialTimestamp);
  const [range, setRange] = useState<TimeRange>("30d");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All roles");
  const [seniorityFilter, setSeniorityFilter] = useState<SeniorityFilter>("All seniority");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("All regions");
  const [exportFormat, setExportFormat] = useState("csv");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(new Date().toISOString());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["analytics", range],
    queryFn: async () => getAnalyticsSnapshot(range),
    staleTime: Infinity,
  });

  useLayoutEffect(() => {
    if (isLoading || !data) {
      return;
    }

    const container = contentRef.current;

    if (!container) {
      return;
    }

    container.dataset.revealReady = "true";

    const revealableElements = Array.from(container.querySelectorAll<HTMLElement>(".animate-rise"));

    if (revealableElements.length === 0) {
      return;
    }

    const revealElement = (element: HTMLElement) => {
      element.dataset.revealState = "visible";
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      revealableElements.forEach(revealElement);
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          revealElement(element);
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealableElements.forEach((element) => {
      if (element.dataset.revealState === "visible") {
        return;
      }

      const rect = element.getBoundingClientRect();
      const isAlreadyInView = rect.top <= viewportHeight * 0.9 && rect.bottom >= 0;

      if (isAlreadyInView) {
        revealElement(element);
        return;
      }

      element.dataset.revealState = "pending";
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [data, isLoading]);

  const filteredJobs = (data?.jobs ?? []).filter((row) => {
    const matchesRole = roleFilter === "All roles" || row.role === roleFilter;
    const matchesSeniority = seniorityFilter === "All seniority" || row.seniority === seniorityFilter;
    const matchesRegion = regionFilter === "All regions" || row.region === regionFilter;

    return matchesRole && matchesSeniority && matchesRegion;
  });

  const filteredActivity = (data?.activity ?? []).filter((item) => {
    const matchesRole = roleFilter === "All roles" || item.role === roleFilter;
    const matchesSeniority = seniorityFilter === "All seniority" || item.seniority === seniorityFilter;
    const matchesRegion = regionFilter === "All regions" || item.region === regionFilter;

    return matchesRole && matchesSeniority && matchesRegion;
  });

  const jobsToRender = filteredJobs;
  const activityToRender = filteredActivity;

  function clearFilters() {
    setRoleFilter(ROLE_FILTER_OPTIONS[0]);
    setSeniorityFilter(SENIORITY_FILTER_OPTIONS[0]);
    setRegionFilter(REGION_FILTER_OPTIONS[0]);
  }

  return (
    <div ref={contentRef} className="analytics-scroll-stage space-y-5 text-[#f2eae3]">
      <header className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Recruiter Analytics</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#f2eae3]">Hiring Intelligence</h1>
            <p className="mt-2 text-sm text-[#a8a29e]">
              Live ISO timestamp · {timestamp}
              <span className="mx-2 text-[#a8a29e80]">•</span>
              {isFetching ? "Refreshing snapshot" : "Snapshot stable"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TimeRangeTabs value={range} onValueChange={setRange} />
            <FiltersDropdown
              roleFilter={roleFilter}
              seniorityFilter={seniorityFilter}
              regionFilter={regionFilter}
              setRoleFilter={setRoleFilter}
              setSeniorityFilter={setSeniorityFilter}
              setRegionFilter={setRegionFilter}
            />
            <ExportPopover exportFormat={exportFormat} setExportFormat={setExportFormat} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[roleFilter, seniorityFilter, regionFilter].map((filter) => (
            <span key={filter} className={cn("rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#a8a29e]")}>{filter}</span>
          ))}
          {isLoading ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#a8a29e]">
              <LoaderCircle className="size-3.5 animate-spin" />
              Loading analytics
            </span>
          ) : null}
        </div>
      </header>

      {isLoading || !data ? (
        <AnalyticsLoadingState />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.kpis.map((metric, index) => (
              <KpiCard key={metric.id} metric={metric} delay={index * 90} />
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <PipelineFunnel stages={data.pipeline} />
            </div>
            <div className="lg:col-span-5">
              {activityToRender.length > 0 ? (
                <ActivityFeed items={activityToRender.slice(0, 8)} />
              ) : (
                <EmptyFilterState title="Live Activity" className="[animation-delay:180ms]" onClearFilters={clearFilters} />
              )}
            </div>
          </section>

          <MatchDistribution buckets={data.distribution} />

          <section className="grid gap-5 lg:grid-cols-2">
            <SkillTreemap nodes={data.skillDemand} />
            <SkillRadar data={data.radar} />
          </section>

          {jobsToRender.length > 0 ? (
            <JobsTable rows={jobsToRender} />
          ) : (
            <EmptyFilterState title="Jobs Performance" className="[animation-delay:420ms]" onClearFilters={clearFilters} />
          )}

          <InsightsCard insights={data.insights} />
        </>
      )}
    </div>
  );
}
