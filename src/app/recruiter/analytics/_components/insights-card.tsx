"use client";

import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { InsightItem } from "./mock-data";
import { Button } from "@/components/ui/button";

type InsightsCardProps = {
  insights: InsightItem[];
};

export function InsightsCard({ insights }: InsightsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeInsight = insights[activeIndex] ?? insights[0];

  function move(direction: "next" | "prev") {
    if (direction === "next") {
      setActiveIndex((current) => (current + 1) % insights.length);
      return;
    }

    setActiveIndex((current) => (current - 1 + insights.length) % insights.length);
  }

  return (
    <section className="animate-rise rounded-2xl border border-[#ac4bff33] bg-gradient-to-r from-[#ac4bff0d] to-[#3080ff0d] p-5 transition hover:border-[#ac4bff66] [animation-delay:480ms] lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ac4bff33] bg-[#ac4bff0d] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#d8b4fe]">
            <Sparkles className="size-3.5" />
            {activeInsight.headline} · {activeIndex + 1} of {insights.length}
          </div>
          <p className="mt-5 max-w-4xl text-lg leading-9 text-[#f2eae3]">{activeInsight.message}</p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={() => move("prev")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffffff12] bg-[#111113] text-[#f2eae3] outline-none transition hover:border-[#ffffff1a] hover:bg-[#17171a] focus-visible:ring-2 focus-visible:ring-[#f99c00]"
                aria-label="Previous insight"
              >
                <ChevronLeft className="size-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 px-3 py-2 font-mono text-[11px] text-[#f2eae3] shadow-2xl backdrop-blur">
                Previous insight
                <Tooltip.Arrow className="fill-[#0c0c0e]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                onClick={() => move("next")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffffff12] bg-[#111113] text-[#f2eae3] outline-none transition hover:border-[#ffffff1a] hover:bg-[#17171a] focus-visible:ring-2 focus-visible:ring-[#f99c00]"
                aria-label="Next insight"
              >
                <ChevronRight className="size-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 px-3 py-2 font-mono text-[11px] text-[#f2eae3] shadow-2xl backdrop-blur">
                Next insight
                <Tooltip.Arrow className="fill-[#0c0c0e]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8a29e]">{activeInsight.supportLabel}</p>
          <p className="mt-2 font-mono text-2xl text-[#f2eae3] tabular-nums">{activeInsight.supportValue}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="h-11 rounded-xl px-5 shadow-[0_0_30px_rgba(249,156,0,0.15)]">Apply suggestion</Button>
          <Button variant="ghost" className="h-11 rounded-xl px-5 text-[#f2eae3] hover:bg-[#111113]">
            Dismiss
          </Button>
        </div>
      </div>
    </section>
  );
}
