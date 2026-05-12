"use client";

import { useId } from "react";
import { HoverCard } from "radix-ui";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { KpiMetric } from "./mock-data";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  metric: KpiMetric;
  delay: number;
};

type SparklineTooltipProps = {
  active?: boolean;
  payload?: Array<{
    color?: string;
    value?: number;
    payload: {
      step: string;
      value: number;
    };
  }>;
};

function SparklineTooltip({ active, payload }: SparklineTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-3 shadow-2xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">{point.step}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-[#f2eae3] tabular-nums">{point.value}</p>
    </div>
  );
}

export function KpiCard({ metric, delay }: KpiCardProps) {
  const gradientId = useId().replace(/:/g, "");
  const DeltaIcon = metric.deltaDirection === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <HoverCard.Root openDelay={120} closeDelay={80}>
      <article
        className="group animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition duration-300 hover:border-[#ffffff1a] lg:p-6"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">{metric.label}</p>
            <p className="mt-4 font-mono text-4xl font-semibold tracking-[-0.06em] tabular-nums" style={{ color: metric.accentColor }}>
              {metric.value}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#a8a29e]">{metric.description}</p>
          </div>

          <HoverCard.Trigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] outline-none transition focus-visible:ring-2 focus-visible:ring-[#f99c00]",
                metric.deltaDirection === "up"
                  ? "border-[#00bb7f1a] bg-[#00bb7f0d] text-[#7ef0c8]"
                  : "border-[#ef44441a] bg-[#ef44440d] text-[#fca5a5]"
              )}
            >
              <DeltaIcon className="size-3.5" />
              {metric.delta}
              <span className="text-[#a8a29e]">vs prev</span>
            </button>
          </HoverCard.Trigger>
        </div>

        <div className="mt-6 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metric.sparkline} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`kpi-gradient-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.accentColor} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={metric.accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={<SparklineTooltip />} cursor={{ stroke: "#ffffff12", strokeDasharray: "3 3" }} />
              <Area
                dataKey="value"
                type="monotone"
                stroke={metric.accentColor}
                strokeWidth={2}
                fill={`url(#kpi-gradient-${gradientId})`}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <HoverCard.Portal>
        <HoverCard.Content className="w-[280px] rounded-2xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-4 shadow-2xl backdrop-blur data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:slide-in-from-top-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a8a29e]">{metric.hoverTitle}</p>
          <p className="mt-3 text-sm leading-6 text-[#f2eae3]">{metric.hoverBody}</p>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
