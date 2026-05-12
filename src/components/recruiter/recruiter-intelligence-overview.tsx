"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Filter,
  GitBranch,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemoCandidateById, type FitBand } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

function fitBandClasses(fitBand: FitBand) {
  if (fitBand === "Strong fit") {
    return {
      pill: "border-[#3af28d33] bg-[#3af28d12] text-[#7af7aa]",
      action: "border-[#3af28d2b] bg-[#3af28d12] text-[#7af7aa]",
    };
  }

  if (fitBand === "Good fit") {
    return {
      pill: "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]",
      action: "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]",
    };
  }

  return {
    pill: "border-[#ffffff12] bg-[#ffffff0a] text-[#a8a29e]",
    action: "border-[#ffffff12] bg-[#ffffff08] text-[#a8a29e]",
  };
}

function titleCase(input: string) {
  return input
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function RecruiterIntelligenceOverview() {
  const { candidateHref, featuredCandidate, featuredMatch, matchesHref, session } = useDemoSession();
  const [query, setQuery] = useState("");
  const [activeFocus, setActiveFocus] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const focusTags = session.job.mustHaveTechnologies
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  const rankedCandidates = session.matches.map((match) => ({
    match,
    candidate: getDemoCandidateById(match.id),
  }));

  const filteredCandidates = rankedCandidates.filter(({ match, candidate }) => {
    const haystack = [
      match.name,
      match.location,
      match.topRepo,
      match.stage,
      match.matchSummary,
      match.strengths.join(" "),
      candidate.focusAreas.join(" "),
      candidate.topRepos.map((repo) => repo.name).join(" "),
    ]
      .join(" ")
      .toLowerCase();

    const passesQuery = deferredQuery.length === 0 || haystack.includes(deferredQuery);
    const passesFocus = !activeFocus || haystack.includes(activeFocus.toLowerCase());

    return passesQuery && passesFocus;
  });

  const reviewReadyCount = session.matches.filter((candidate) => candidate.fitBand !== "Needs review").length;
  const promptCount = featuredCandidate.interviewKit.questions.length;
  const activeRoleMeta = `${session.job.seniority} · ${session.job.location}`;
  const pendingReviewCount = session.matches.length - reviewReadyCount;
  const featuredQuestion = featuredCandidate.interviewKit.questions[0];

  const signalCards = [
    {
      label: "Shortlist",
      value: String(session.matches.length).padStart(2, "0"),
      detail: `Candidates currently stacked against ${session.job.title}.`,
      icon: UsersRound,
      tone: "border-[#ff65681f] bg-[linear-gradient(180deg,rgba(255,101,104,0.12),rgba(255,101,104,0.02))] text-[#ff9b9d]",
    },
    {
      label: "Review ready",
      value: String(reviewReadyCount).padStart(2, "0"),
      detail: "Strong fit and good fit candidates ready for review.",
      icon: Sparkles,
      tone: "border-[#3af28d1f] bg-[linear-gradient(180deg,rgba(58,242,141,0.12),rgba(58,242,141,0.02))] text-[#7af7aa]",
    },
    {
      label: "Prompt bank",
      value: String(promptCount).padStart(2, "0"),
      detail: `Role-tied prompts ready for ${featuredCandidate.name}.`,
      icon: Radar,
      tone: "border-[#f99c001f] bg-[linear-gradient(180deg,rgba(249,156,0,0.12),rgba(249,156,0,0.02))] text-[#f99c00]",
    },
    {
      label: "Needs review",
      value: String(pendingReviewCount).padStart(2, "0"),
      detail: activeFocus ? `Filtered against ${activeFocus}.` : "Candidates that still need recruiter judgment.",
      icon: Target,
      tone: "border-[#ffffff14] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] text-[#d6d3d1]",
    },
  ];

  return (
    <div className="space-y-6 text-[#f2eae3]">
      <section className="relative overflow-hidden rounded-[32px] border border-[#ffffff12] bg-[linear-gradient(180deg,rgba(17,17,19,0.98),rgba(10,10,12,0.98))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] lg:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(228,0,43,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,156,0,0.12),transparent_34%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[#e4002b33] bg-[#e4002b0d] px-3 py-1.5 text-[10px] text-[#ff6568]">
                <Sparkles className="size-3.5" />
                Recruiter lane
              </Badge>
              <Badge variant="secondary" className="border-[#ffffff12] bg-[#111113] px-3 py-1.5 text-[10px] text-[#a8a29e]">
                Live demo session
              </Badge>
            </div>

            <div className="max-w-4xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8b868d]">
                Recruiter command center
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#f8f5f2] sm:text-[3.35rem]">
                Shape the role, read the market, and move the shortlist with confidence.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#b2ada8]">
                The active brief, the best-fit candidate story, and the interview signal all sit in one recruiter view so you can make decisions without bouncing between screens.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] border border-[#ffffff12] bg-[#111113cc] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">Active role</p>
                <p className="mt-2 text-lg font-semibold text-[#f8f5f2]">{session.job.title}</p>
                <p className="mt-1 text-sm text-[#a8a29e]">{activeRoleMeta}</p>
              </div>

              <div className="rounded-[20px] border border-[#ffffff12] bg-[#111113cc] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">Hiring lead</p>
                <p className="mt-2 text-lg font-semibold text-[#f8f5f2]">{session.job.hiringManager}</p>
                <p className="mt-1 text-sm text-[#a8a29e]">Brief updated {session.updatedAt}</p>
              </div>

              <div className="rounded-[20px] border border-[#ffffff12] bg-[#111113cc] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">Featured candidate</p>
                <p className="mt-2 text-lg font-semibold text-[#f8f5f2]">{featuredCandidate.name}</p>
                <p className="mt-1 text-sm text-[#a8a29e]">{featuredMatch.fitBand} • Shared candidate story ready</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex h-12 w-full max-w-[560px] items-center gap-3 rounded-[14px] border border-[#ffffff12] bg-[#111113] px-4 text-[#a8a29e]">
                <Filter className="size-4 text-[#ff6568]" />
                <Search className="size-4 text-[#6b6670]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search candidate, repo, stage, or skill..."
                  className="h-full w-full border-0 bg-transparent text-sm text-[#f2eae3] outline-none placeholder:text-[#6b6670]"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-[14px] border-[#ffffff12] bg-[#111113] px-5 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
                >
                  <Link href={matchesHref}>Open matches board</Link>
                </Button>
                <Button asChild className="h-12 rounded-[14px] px-5 text-sm font-semibold">
                  <Link href="/recruiter/jobs/new">
                    Create new role
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {focusTags.map((tag) => {
                const isActive = activeFocus === tag;

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveFocus(isActive ? null : tag)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition",
                      isActive
                        ? "border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568]"
                        : "border-[#ffffff12] bg-[#111113] text-[#a8a29e] hover:border-[#ffffff1f] hover:bg-[#17171a] hover:text-[#f2eae3]"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[26px] border border-[#ffffff12] bg-[linear-gradient(180deg,rgba(20,20,24,0.96),rgba(12,12,14,0.96))] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">Active role snapshot</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f8f5f2]">{session.job.title}</h2>
                </div>
                <span className="rounded-full border border-[#3af28d33] bg-[#3af28d12] px-3 py-1 font-mono text-[11px] text-[#7af7aa]">
                  {featuredMatch.fitBand}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[#a8a29e]">{session.job.roleBrief}</p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[18px] border border-[#ffffff0f] bg-[#0f0f12] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b868d]">Must-have stack</p>
                  <p className="mt-2 text-sm leading-6 text-[#f2eae3]">{focusTags.join(" · ")}</p>
                </div>
                <div className="rounded-[18px] border border-[#ffffff0f] bg-[#0f0f12] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b868d]">Recommended next move</p>
                  <p className="mt-2 text-sm leading-6 text-[#f2eae3]">Open matches, compare the top two signals, then push the interview invite for the seeded candidate.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#f99c001a] bg-[#0f0f12] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
              <div className="flex items-center gap-2 text-[#f99c00]">
                <Radar className="size-4" />
                <p className="font-mono text-[10px] uppercase tracking-[0.28em]">Interview readout</p>
              </div>
              <p className="mt-4 text-lg font-semibold leading-8 text-[#f8f5f2]">
                {featuredQuestion?.prompt ?? "Interview prompt loading..."}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#a8a29e]">
                {featuredQuestion?.followUp ?? "Follow-up prompts will appear with the active candidate story."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {signalCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className={cn("rounded-[24px] border p-5 shadow-[0_18px_44px_rgba(0,0,0,0.2)]", card.tone)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">{card.label}</p>
                  <p className="mt-5 font-mono text-5xl font-semibold tracking-[-0.07em] text-[#f8f5f2]">{card.value}</p>
                  <p className="mt-3 text-sm leading-6 text-[#b8b2ac]">{card.detail}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center text-current">
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_360px]">
        <div className="rounded-[28px] border border-[#ffffff12] bg-[#111113] shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-col gap-4 border-b border-[#ffffff0a] px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">Ranked talent board</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#f8f5f2]">Shortlist built for recruiter review</h2>
              <p className="mt-2 text-sm leading-6 text-[#a8a29e]">
                {filteredCandidates.length} visible candidate{filteredCandidates.length === 1 ? "" : "s"} for {session.job.title}.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-[12px] border-[#ffffff12] bg-[#111113] px-4 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
              >
                <Link href={candidateHref}>Open featured story</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-[#ffffff0a] px-5 py-4">
            <span className="rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1.5 text-xs text-[#a8a29e]">
              Hiring manager: {session.job.hiringManager}
            </span>
            <span className="rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1.5 text-xs text-[#a8a29e]">
              Brief updated: {session.updatedAt}
            </span>
            <span className="rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1.5 text-xs text-[#a8a29e]">
              Active priorities: {focusTags.join(" / ")}
            </span>
          </div>

          <div className="space-y-3 p-5">
            {filteredCandidates.length === 0 ? (
              <div className="rounded-[22px] border border-[#ffffff12] bg-[#0c0c0e] px-5 py-8 text-sm leading-7 text-[#a8a29e]">
                No candidates matched this filter. Try another skill, repo, or candidate name.
              </div>
            ) : (
              filteredCandidates.map(({ match, candidate }) => {
                const styles = fitBandClasses(match.fitBand);
                const isFeatured = match.id === session.featuredCandidateId;
                const rowActionLabel =
                  match.fitBand === "Strong fit"
                    ? "Open story"
                    : match.fitBand === "Good fit"
                      ? "Compare"
                      : "Needs recruiter review";

                return (
                  <article
                    key={match.id}
                    className={cn(
                      "rounded-[22px] border p-5 transition",
                      isFeatured
                        ? "border-[#e4002b26] bg-[linear-gradient(180deg,rgba(228,0,43,0.08),rgba(17,17,19,0.92))]"
                        : "border-[#ffffff0f] bg-[#0c0c0e] hover:border-[#ffffff1c] hover:bg-[#111113]"
                    )}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#ffffff12] bg-[#17171a] font-mono text-sm text-[#f2eae3]">
                          {candidate.initials}
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-[#f8f5f2]">{candidate.name}</h3>
                            {isFeatured ? (
                              <span className="rounded-full border border-[#e4002b33] bg-[#e4002b0d] px-2.5 py-1 text-[10px] font-medium text-[#ff6568]">
                                Featured candidate
                              </span>
                            ) : null}
                            <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", styles.pill)}>
                              {match.fitBand}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[#a8a29e]">{candidate.location} • {match.stage}</p>
                          <p className="mt-2 text-sm leading-7 text-[#d8d0ca]">{candidate.headline}</p>
                        </div>
                      </div>

                      <div className="rounded-[18px] border border-[#ffffff10] bg-[#111113] px-4 py-3 lg:min-w-[220px]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b868d]">Top signal</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-[#f2eae3]">
                          <GitBranch className="size-4 text-[#ff6568]" />
                          {match.topRepo}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {candidate.focusAreas.slice(0, 3).map((area) => (
                            <span key={`${candidate.id}-${area}`} className="rounded-full border border-[#ffffff12] bg-[#17171a] px-2.5 py-1 text-xs text-[#d8d0ca]">
                              {titleCase(area)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
                      <div>
                        <p className="text-sm leading-7 text-[#d8d0ca]">{match.matchSummary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {match.strengths.map((strength) => (
                            <span
                              key={`${match.id}-${strength}`}
                              className="rounded-full border border-[#3af28d1f] bg-[#3af28d0d] px-2.5 py-1 text-xs text-[#7af7aa]"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[18px] border border-[#ffffff10] bg-[#111113] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b868d]">Action</p>
                        <p className="mt-3 text-sm leading-6 text-[#f2eae3]">{rowActionLabel}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {isFeatured ? (
                            <Button asChild className="h-10 rounded-[12px] px-4 text-sm">
                              <Link href={candidateHref}>Open story</Link>
                            </Button>
                          ) : null}
                          <Button
                            asChild
                            variant="outline"
                            className="h-10 rounded-[12px] border-[#ffffff12] bg-[#111113] px-4 text-sm text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
                          >
                            <Link href={matchesHref}>Matches board</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-[28px] border border-[#ffffff12] bg-[#111113] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8b868d]">Featured reasoning</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f8f5f2]">{featuredCandidate.name}</h2>
                <p className="mt-1 text-sm text-[#a8a29e]">{featuredCandidate.location}</p>
              </div>
              <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", fitBandClasses(featuredMatch.fitBand).pill)}>
                {featuredMatch.fitBand}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#d8d0ca]">{featuredMatch.matchSummary}</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#7af7aa]">
                  <Sparkles className="size-3.5" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Strengths</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featuredMatch.strengths.map((strength) => (
                    <span key={strength} className="rounded-full border border-[#3af28d1f] bg-[#3af28d0d] px-2.5 py-1 text-xs text-[#7af7aa]">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-[#f99c00]">
                  <ShieldAlert className="size-3.5" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em]">Watchouts</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featuredMatch.watchouts.map((watchout) => (
                    <span key={watchout} className="rounded-full border border-[#f99c001f] bg-[#f99c000d] px-2.5 py-1 text-xs text-[#f99c00]">
                      {watchout}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#ffffff12] bg-[#111113] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-2 text-[#ff6568]">
              <BriefcaseBusiness className="size-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em]">Role priorities</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#d8d0ca]">{session.job.interviewBrief}</p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-[18px] border border-[#ffffff0f] bg-[#0f0f12] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b868d]">Active stack</p>
                <p className="mt-2 text-sm leading-6 text-[#f2eae3]">{session.job.mustHaveTechnologies}</p>
              </div>
              <div className="rounded-[18px] border border-[#ffffff0f] bg-[#0f0f12] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8b868d]">Fast path</p>
                <p className="mt-2 text-sm leading-6 text-[#f2eae3]">Open the featured story for narrative context, then jump into the interview flow for the live prompt set.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild className="h-10 rounded-[12px] px-4 text-sm">
                    <Link href={candidateHref}>Featured story</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-[12px] border-[#ffffff12] bg-[#111113] px-4 text-sm text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
                  >
                    <Link href={matchesHref}>Matches board</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}