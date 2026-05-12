"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ClipboardList,
  Code2,
  Filter,
  GitBranch,
  Radar,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillRadar } from "@/components/ui/skill-radar";
import { dashboardPageTheme } from "@/lib/dashboard-page-theme";
import { formatRoleTitleFromSlug } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

function fitBandClasses(value: string) {
  if (value === "Strong fit") {
    return "border-[#3af28d33] bg-[#3af28d12] text-[#7af7aa]";
  }

  if (value === "Good fit") {
    return "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]";
  }

  return "border-[#ffffff12] bg-[#ffffff08] text-[#a8a29e]";
}

function titleCase(input: string) {
  return input
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function difficultyClasses(difficulty: string) {
  if (difficulty === "Stretch") {
    return "border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568]";
  }

  if (difficulty === "Core") {
    return "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]";
  }

  return "border-[#ffffff12] bg-[#111113] text-[#a8a29e]";
}

export function CandidateProfileView() {
  const { featuredCandidate, featuredMatch, matchesHref, session } = useDemoSession();
  const [query, setQuery] = useState("");
  const [activeFocus, setActiveFocus] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const focusTags = featuredCandidate.focusAreas.slice(0, 4);
  const visibleRepos = featuredCandidate.topRepos.filter((repo) => {
    const haystack = [
      repo.name,
      repo.summary,
      repo.signal,
      repo.focus,
      featuredCandidate.strengths.join(" "),
      featuredCandidate.signalReadouts.map((item) => `${item.label} ${item.explanation}`).join(" "),
      featuredCandidate.activitySummary,
    ]
      .join(" ")
      .toLowerCase();

    const passesQuery = deferredQuery.length === 0 || haystack.includes(deferredQuery);
    const passesFocus = !activeFocus || haystack.includes(activeFocus.toLowerCase());

    return passesQuery && passesFocus;
  });

  const statCards = [
    {
      label: "MATCH READOUT",
      value: featuredMatch.fitBand,
      detail: `Current recruiter readout for ${featuredCandidate.name}.`,
      accent: "border-t-[#ff6568]",
      iconClassName: "text-[#ff6568]",
      icon: Sparkles,
    },
    {
      label: "REPO ANCHORS",
      value: String(featuredCandidate.topRepos.length).padStart(2, "0"),
      detail: "Shared evidence carried into the recruiter view.",
      accent: "border-t-[#ffffff1f]",
      iconClassName: "text-[#f2eae3]",
      icon: GitBranch,
    },
    {
      label: "QUESTION BANK",
      value: String(featuredCandidate.interviewKit.questions.length).padStart(2, "0"),
      detail: `Prompt set ready for ${session.job.title}.`,
      accent: "border-t-[#f99c00]",
      iconClassName: "text-[#f99c00]",
      icon: Radar,
    },
  ];

  return (
    <div className={dashboardPageTheme.page}>
      <section className={dashboardPageTheme.hero}>
        <div className={dashboardPageTheme.heroGlow} />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={dashboardPageTheme.highlightBadge}>
                <Sparkles className="size-3.5" />
                Demo candidate
              </Badge>
              <Badge variant="secondary" className={dashboardPageTheme.contextBadge}>
                {session.job.title}
              </Badge>
            </div>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#f2eae3] sm:text-[2.8rem]">
                Candidate Intelligence
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-7 text-[#a8a29e]">
                Shared profile evidence, recruiter readout, and readiness signals for the active demo session.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#a8a29e]">
              <span className={cn(dashboardPageTheme.metaPill, "text-sm text-[#a8a29e]")}>
                <UserRound className="size-3.5 text-[#ff6568]" />
                github.com/{featuredCandidate.githubHandle}
              </span>
              <span className={cn(dashboardPageTheme.metaPill, "text-sm text-[#a8a29e]")}>
                {featuredCandidate.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className={dashboardPageTheme.searchShell}>
              <Filter className="size-4 text-[#ff6568]" />
              <Search className="size-4 text-[#6b6670]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter repo, signal, or skill..."
                className={dashboardPageTheme.searchInput}
              />
            </div>

            <Button asChild variant="outline" className={dashboardPageTheme.outlineButton}>
              <Link href={matchesHref}>Open Recruiter View</Link>
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {focusTags.map((tag) => {
            const isActive = activeFocus === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveFocus(isActive ? null : tag)}
                className={cn(
                  dashboardPageTheme.filterChipBase,
                  isActive ? dashboardPageTheme.filterChipActive : dashboardPageTheme.filterChipIdle
                )}
              >
                {titleCase(tag)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label} className={cn(dashboardPageTheme.statCard, card.accent)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">{card.label}</p>
                    <p className="mt-6 font-mono text-4xl font-semibold tracking-[-0.06em] text-[#f2eae3] sm:text-5xl">{card.value}</p>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-[#a8a29e]">{card.detail}</p>
                  </div>
                  <span className={cn(dashboardPageTheme.statIconWrap, card.iconClassName)}>
                    <Icon className="size-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className={dashboardPageTheme.panel}>
        <div className={cn("flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between", dashboardPageTheme.panelDivider)}>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#f2eae3]">Prompt Bank</h2>
            <p className="mt-1 text-sm leading-6 text-[#a8a29e]">
              Active interview prompts tied to {session.job.title} and the same recruiter-facing reasoning.
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[22px] border border-[#ffffff12] bg-[#0c0c0e] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Active prompt set</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#f2eae3]">{session.job.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#a8a29e]">{featuredCandidate.interviewKit.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#a8a29e]">
              <span className={dashboardPageTheme.subtlePill}>Updated {session.updatedAt}</span>
              <span className={cn("rounded-full border px-3 py-1.5", fitBandClasses(featuredMatch.fitBand))}>
                Recruiter readout: {featuredMatch.fitBand}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className={dashboardPageTheme.nestedCard}>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Question bank</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#f2eae3]">
                {featuredCandidate.interviewKit.questions.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#a8a29e]">Role-tied prompts are ready for the next interview step.</p>
            </div>

            <div className={dashboardPageTheme.nestedCard}>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Repo sources</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#f2eae3]">
                {featuredCandidate.interviewKit.repoSources.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#a8a29e]">Seeded repositories backing the interview invite and follow-up prompts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={dashboardPageTheme.panel}>
        <div className={cn("flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between", dashboardPageTheme.panelDivider)}>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#f2eae3]">Evidence Board</h2>
            <p className="mt-1 text-sm leading-6 text-[#a8a29e]">
              Shared repository evidence for {featuredCandidate.name}. {visibleRepos.length} visible repo{visibleRepos.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className={dashboardPageTheme.outlineButton}
            >
              <Link href={matchesHref}>Open Recruiter View</Link>
            </Button>
          </div>
        </div>

        <div className={cn("px-5 py-4", dashboardPageTheme.panelDivider)}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={dashboardPageTheme.subtlePill}>
              Active role: {session.job.title}
            </span>
            <span className={cn("rounded-full border px-3 py-1.5 text-xs", fitBandClasses(featuredMatch.fitBand))}>
              Recruiter readout: {featuredMatch.fitBand}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className={cn("text-left", dashboardPageTheme.panelDivider)}>
                {["Repository", "Signal", "Focus", "Why It Matters", "Action"].map((heading) => (
                  <th key={heading} className={dashboardPageTheme.tableHeading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRepos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-sm text-[#a8a29e]">
                    No repo evidence matched this filter. Try another skill, repo, or signal.
                  </td>
                </tr>
              ) : (
                visibleRepos.map((repo, index) => (
                  <tr key={repo.name} className={dashboardPageTheme.tableRow}>
                    <td className="px-5 py-5 align-top">
                      <div>
                        <p className="text-lg font-semibold text-[#f2eae3]">{repo.name}</p>
                        <p className="mt-1 text-sm text-[#a8a29e]">{repo.signal}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5 align-top">
                      <span className="inline-flex rounded-[8px] border border-[#e4002b33] bg-[#e4002b0d] px-3 py-1.5 text-sm text-[#ff6568]">
                        {repo.signal}
                      </span>
                    </td>
                    <td className="px-5 py-5 align-top">
                      <p className="max-w-[220px] text-sm leading-6 text-[#d8d0ca]">{repo.focus}</p>
                    </td>
                    <td className="px-5 py-5 align-top">
                      <p className="max-w-md text-sm leading-6 text-[#d8d0ca]">{repo.summary}</p>
                    </td>
                    <td className="px-5 py-5 align-top">
                      <span className="inline-flex rounded-[8px] border border-[#ffffff12] bg-[#17171a] px-3 py-2 text-sm text-[#f2eae3]">
                        {index === 0 ? "Lead evidence" : "Use in follow-up"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <section className={dashboardPageTheme.panel}>
          <div className={cn("px-5 py-5", dashboardPageTheme.panelDivider)}>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f2eae3]">Signal Matrix</h2>
            <p className="mt-1 text-sm leading-6 text-[#a8a29e]">Why this profile stays coherent across recruiter and candidate views.</p>
          </div>
          <div className="space-y-3 p-5">
            {featuredCandidate.signalReadouts.map((signal) => (
              <div key={signal.label} className={dashboardPageTheme.nestedCard}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#f2eae3]">{signal.label}</p>
                  <span className={cn("rounded-[8px] border px-3 py-1 text-xs", fitBandClasses(signal.value))}>{signal.value}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#a8a29e]">{signal.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className={dashboardPageTheme.panel}>
            <div className={cn("px-5 py-5", dashboardPageTheme.panelDivider)}>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f2eae3]">Strength Radar</h2>
              <p className="mt-1 text-sm leading-6 text-[#a8a29e]">Visual summary of the strongest seeded evidence areas.</p>
            </div>
            <div className="p-5">
              <SkillRadar data={featuredCandidate.radarData} accentColor={dashboardPageTheme.chartAccentColor} />
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredCandidate.strengths.map((strength) => (
                  <span key={strength} className="rounded-full border border-[#3af28d33] bg-[#3af28d12] px-3 py-1.5 text-xs text-[#7af7aa]">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className={dashboardPageTheme.panel}>
            <div className={cn("px-5 py-5", dashboardPageTheme.panelDivider)}>
              <div className="flex items-center gap-2 text-sm text-[#a8a29e]">
                <Shield className="size-4 text-[#ff6568]" />
                Readiness
              </div>
            </div>
            <div className="space-y-3 p-5">
              {featuredCandidate.readiness.map((item) => (
                <div key={item.label} className={dashboardPageTheme.nestedCard}>
                  <p className="text-sm font-medium text-[#f2eae3]">{item.label}</p>
                  <p className="mt-2 font-mono text-sm text-[#ff6568]">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#a8a29e]">{item.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

type InterviewKitViewProps = {
  jobSlug: string;
};

export function InterviewKitView({ jobSlug }: InterviewKitViewProps) {
  const { featuredCandidate, featuredMatch, session, syncToSlug } = useDemoSession();

  useEffect(() => {
    syncToSlug(jobSlug);
  }, [jobSlug, syncToSlug]);

  const isRoleReady = session.job.slug === jobSlug;
  const roleTitle = isRoleReady ? session.job.title : formatRoleTitleFromSlug(jobSlug);
  const candidateName = isRoleReady ? featuredCandidate.name : "Preparing candidate story";
  const interviewBrief = isRoleReady ? session.job.interviewBrief : "Preparing the interview brief for this role.";
  const interviewKit = isRoleReady ? featuredCandidate.interviewKit : null;
  const readiness = isRoleReady ? featuredCandidate.readiness : [];
  const signalReadouts = isRoleReady ? featuredMatch.signalReadouts : [];
  const promptCount = interviewKit?.questions.length ?? 0;
  const repoCount = interviewKit?.repoSources.length ?? 0;
  const matchesHref = `/recruiter/jobs/${jobSlug}/matches`;

  const statCards = [
    {
      label: "PROMPT BANK",
      value: String(promptCount).padStart(2, "0"),
      detail: `Role-tied prompts prepared for ${roleTitle}.`,
      icon: ClipboardList,
      accent: "border-t-[#f99c00]",
      iconClassName: "text-[#f99c00]",
    },
    {
      label: "REPO ANCHORS",
      value: String(repoCount).padStart(2, "0"),
      detail: "Seeded repositories backing the interview prompts.",
      icon: GitBranch,
      accent: "border-t-[#ffffff1f]",
      iconClassName: "text-[#f2eae3]",
    },
    {
      label: "READINESS SIGNALS",
      value: String(readiness.length).padStart(2, "0"),
      detail: `Shared recruiter readout for ${candidateName}.`,
      icon: ShieldCheck,
      accent: "border-t-[#3af28d33]",
      iconClassName: "text-[#7af7aa]",
    },
  ];

  return (
    <div className={dashboardPageTheme.page}>
      <section className={dashboardPageTheme.hero}>
        <div className={dashboardPageTheme.heroGlow} />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px] xl:items-end">
          <div className="space-y-5">
            <Button asChild variant="ghost" className="h-8 w-fit rounded-full px-0 text-[#a8a29e] hover:bg-transparent hover:text-[#f2eae3]">
              <Link href="/candidate">
                <ArrowLeft className="size-3.5" />
                Back to dashboard
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={dashboardPageTheme.highlightBadge}>
                <BrainCircuit className="size-3.5" />
                Interview flow
              </Badge>
              <Badge variant="secondary" className={dashboardPageTheme.contextBadge}>
                {roleTitle}
              </Badge>
            </div>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#f2eae3] sm:text-[2.9rem]">
                Candidate Interview Kit
              </h1>
              <p className="mt-2 max-w-3xl text-base leading-7 text-[#a8a29e]">
                {interviewKit?.summary ?? "Preparing the active prompt set, repo anchors, and recruiter signal for this role."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 rounded-[8px] px-5 text-sm font-semibold">
                <Link href={matchesHref}>
                  Open recruiter matches
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className={dashboardPageTheme.outlineButton}>
                <Link href="/candidate">Open candidate story</Link>
              </Button>
            </div>
          </div>

          <aside className={dashboardPageTheme.nestedCard}>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Featured candidate</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#f2eae3]">{candidateName}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#a8a29e]">
              <span className={dashboardPageTheme.subtlePill}>{isRoleReady ? featuredCandidate.location : "Syncing role session"}</span>
              <span className={cn("rounded-full border px-3 py-1.5 font-mono", fitBandClasses(featuredMatch.fitBand))}>
                {featuredMatch.fitBand}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#a8a29e]">
              {isRoleReady
                ? featuredMatch.matchSummary
                : "Fetching the candidate story and recruiter reasoning tied to this route."}
            </p>
            <div className="mt-5 rounded-[16px] border border-[#ffffff0a] bg-[#0c0c0e] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Interview brief</p>
              <p className="mt-2 text-sm leading-6 text-[#f2eae3]">{interviewBrief}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label} className={cn(dashboardPageTheme.statCard, card.accent)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">{card.label}</p>
                    <p className="mt-6 font-mono text-4xl font-semibold tracking-[-0.06em] text-[#f2eae3] sm:text-5xl">{card.value}</p>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-[#a8a29e]">{card.detail}</p>
                  </div>
                  <span className={cn(dashboardPageTheme.statIconWrap, card.iconClassName)}>
                    <Icon className="size-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <section className={dashboardPageTheme.panel}>
            <div className={cn("flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start lg:justify-between", dashboardPageTheme.panelDivider)}>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-[#f2eae3]">Question Bank</h2>
                <p className="mt-1 text-sm leading-6 text-[#a8a29e]">
                  Prompt flow anchored to the same seeded evidence used in the recruiter view.
                </p>
              </div>
              <span className={dashboardPageTheme.subtlePill}>Updated {session.updatedAt}</span>
            </div>

            <div className="grid gap-4 p-5">
              {interviewKit ? (
                interviewKit.questions.map((question) => (
                  <Card key={question.id} className="rounded-[22px] border border-[#ffffff12] bg-[#0c0c0e] shadow-none">
                    <CardHeader className="gap-4 pb-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="border-[#ffffff12] bg-[#111113] text-[#d8d0ca]">
                          Q{question.id}
                        </Badge>
                        <span className={cn("rounded-full border px-3 py-1 font-mono text-[11px]", difficultyClasses(question.difficulty))}>
                          {question.difficulty}
                        </span>
                        <span className="rounded-full border border-[#ffffff12] bg-[#111113] px-3 py-1 font-mono text-[11px] text-[#a8a29e]">
                          {question.type}
                        </span>
                        <span className="rounded-full border border-[#ffffff12] bg-[#111113] px-3 py-1 font-mono text-[11px] text-[#a8a29e]">
                          {question.repo}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-2xl leading-8 text-[#f2eae3]">{question.prompt}</CardTitle>
                        <CardDescription className="mt-2">{question.signal}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-5">
                      <div className="rounded-[18px] border border-[#ffffff0a] bg-[#111113] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Follow-up</p>
                        <p className="mt-2 text-sm leading-6 text-[#f2eae3]">{question.followUp}</p>
                      </div>

                      {question.codeSnippet ? (
                        <div className="overflow-hidden rounded-[18px] border border-[#ffffff0a] bg-[#09090b]">
                          <div className="flex items-center gap-2 border-b border-[#ffffff0a] px-4 py-3 text-[#a8a29e]">
                            <Code2 className="size-4" />
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Discussion snippet</p>
                          </div>
                          <pre className="overflow-x-auto px-4 py-4 text-sm leading-6 text-[#d8d0ca]">
                            <code>{question.codeSnippet}</code>
                          </pre>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="rounded-[20px] border border-[#ffffff12] bg-[#0c0c0e] p-5 text-sm leading-6 text-[#a8a29e]">
                  Preparing the active interview questions for this route.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className={dashboardPageTheme.panel}>
            <div className={cn("px-5 py-5", dashboardPageTheme.panelDivider)}>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f2eae3]">Repo Sources</h2>
              <p className="mt-1 text-sm leading-6 text-[#a8a29e]">Repositories that seed the interview prompts and follow-up conversation.</p>
            </div>
            <div className="grid gap-3 p-5">
              {interviewKit?.repoSources.length ? (
                interviewKit.repoSources.map((source) => (
                  <div key={source.name} className={dashboardPageTheme.nestedCard}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">Repository</p>
                        <p className="mt-2 text-lg font-semibold text-[#f2eae3]">{source.name}</p>
                        <p className="mt-2 text-sm leading-6 text-[#a8a29e]">{source.note}</p>
                      </div>
                      <GitBranch className="mt-1 size-4 text-[#f99c00]" />
                    </div>
                  </div>
                ))
              ) : (
                <div className={dashboardPageTheme.nestedCard}>
                  <p className="text-sm leading-6 text-[#a8a29e]">Repo anchors will appear once the active role session is synchronized.</p>
                </div>
              )}
            </div>
          </section>

          <section className={dashboardPageTheme.panel}>
            <div className={cn("px-5 py-5", dashboardPageTheme.panelDivider)}>
              <h2 className="text-2xl font-semibold tracking-tight text-[#f2eae3]">Interview Signals</h2>
              <p className="mt-1 text-sm leading-6 text-[#a8a29e]">Readiness markers and recruiter-side framing for the active candidate story.</p>
            </div>
            <div className="grid gap-3 p-5">
              {readiness.map((item) => (
                <div key={item.label} className={dashboardPageTheme.nestedCard}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-[#f2eae3]">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#a8a29e]">{item.sub}</p>
                </div>
              ))}

              {signalReadouts.map((signal) => (
                <div key={signal.label} className="rounded-[16px] border border-[#ffffff0a] bg-[#0c0c0e] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">{signal.label}</p>
                    <span className={cn("rounded-full border px-3 py-1 font-mono text-[11px]", fitBandClasses(signal.value))}>
                      {signal.value}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#a8a29e]">{signal.explanation}</p>
                </div>
              ))}

              {!readiness.length && !signalReadouts.length ? (
                <div className={dashboardPageTheme.nestedCard}>
                  <div className="flex items-center gap-2 text-[#a8a29e]">
                    <Sparkles className="size-4" />
                    <p className="text-sm leading-6">Loading readiness and recruiter signals for this interview route.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
