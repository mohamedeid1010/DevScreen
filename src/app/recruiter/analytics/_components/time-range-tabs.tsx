"use client";

import { Tabs } from "radix-ui";
import type { TimeRange } from "./mock-data";
import { TIME_RANGE_OPTIONS } from "./mock-data";
import { cn } from "@/lib/utils";

type TimeRangeTabsProps = {
  value: TimeRange;
  onValueChange: (value: TimeRange) => void;
};

export function TimeRangeTabs({ value, onValueChange }: TimeRangeTabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={(nextValue) => onValueChange(nextValue as TimeRange)}>
      <Tabs.List className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#ffffff12] bg-[#111113] p-1.5">
        {TIME_RANGE_OPTIONS.map((option) => (
          <Tabs.Trigger
            key={option.value}
            value={option.value}
            className={cn(
              "rounded-xl border border-transparent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e] transition outline-none focus-visible:ring-2 focus-visible:ring-[#f99c00]",
              value === option.value
                ? "border-[#f99c001a] bg-[#f99c000d] text-[#f2eae3] shadow-[0_0_30px_rgba(249,156,0,0.15)]"
                : "hover:border-[#ffffff12] hover:bg-[#17171a] hover:text-[#f2eae3]"
            )}
          >
            {option.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
