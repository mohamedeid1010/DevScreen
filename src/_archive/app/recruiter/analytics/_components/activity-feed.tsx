"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Activity, ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react";
import type { ActivityItem } from "./mock-data";
import { cn } from "@/lib/utils";

type ActivityFeedProps = {
  items: ActivityItem[];
};

function toneClasses(tone: ActivityItem["tone"]) {
  if (tone === "positive") {
    return {
      dot: "bg-[#00bb7f]",
      badge: "border-[#00bb7f1a] bg-[#00bb7f0d] text-[#7ef0c8]",
      icon: Sparkles,
    };
  }

  if (tone === "warning") {
    return {
      dot: "bg-[#ef4444]",
      badge: "border-[#ef44441a] bg-[#ef44440d] text-[#fca5a5]",
      icon: ShieldAlert,
    };
  }

  return {
    dot: "bg-[#3080ff]",
    badge: "border-[#3080ff1a] bg-[#3080ff0d] text-[#93c5fd]",
    icon: Activity,
  };
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 hover:border-[#ffffff1a] [animation-delay:180ms] lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Live Activity</p>
          <h2 className="mt-2 text-xl font-semibold text-[#f2eae3]">Pipeline motion</h2>
        </div>
        <span className="rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">
          8 events
        </span>
      </div>

      <ScrollArea.Root className="mt-5 h-[420px] overflow-hidden rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e]">
        <ScrollArea.Viewport className="h-full w-full p-3">
          <div className="space-y-3">
            {items.map((item, index) => {
              const tone = toneClasses(item.tone);
              const ToneIcon = tone.icon;

              return (
                <article
                  key={item.id}
                  className="group rounded-2xl border border-[#ffffff0a] bg-[#111113] p-4 transition hover:border-[#ffffff1a] hover:bg-[#17171a]"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          type="button"
                          className={cn("mt-1 h-2.5 w-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#f99c00]", tone.dot)}
                          aria-label={`${item.tone} event`}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 px-3 py-2 font-mono text-[11px] text-[#f2eae3] shadow-2xl backdrop-blur">
                          {item.tone}
                          <Tooltip.Arrow className="fill-[#0c0c0e]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#f2eae3]">{item.title}</p>
                        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em]", tone.badge)}>
                          <ToneIcon className="size-3" />
                          {item.detail}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#a8a29e]">
                        <span>{item.role}</span>
                        <span className="text-[#a8a29e80]">•</span>
                        <span>{item.region}</span>
                        <span className="text-[#a8a29e80]">•</span>
                        <span>{item.seniority}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#a8a29e]">
                      <span>{item.minutesAgo}m ago</span>
                      <ArrowUpRight className="size-3.5 text-[#a8a29e80] opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="flex w-2.5 touch-none p-0.5">
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-[#ffffff12]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </section>
  );
}
