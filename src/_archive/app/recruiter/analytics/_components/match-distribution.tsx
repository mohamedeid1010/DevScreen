"use client";

import { useId } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MatchDistributionBucket } from "./mock-data";

type MatchDistributionProps = {
  buckets: MatchDistributionBucket[];
};

type DistributionTooltipProps = {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    value?: number;
    payload: MatchDistributionBucket;
  }>;
};

function DistributionTooltip({ active, payload }: DistributionTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const bucket = payload[0]?.payload;
  const count = payload.find((item) => item.dataKey === "count")?.value;
  const cumulative = payload.find((item) => item.dataKey === "cumulative")?.value;

  return (
    <div className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-3 shadow-2xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">{bucket.bucketLabel}</p>
      <p className="mt-2 font-mono text-sm text-[#f2eae3]">Candidates: {count}</p>
      <p className="mt-1 font-mono text-sm text-[#93c5fd]">Cumulative: {cumulative}</p>
    </div>
  );
}

export function MatchDistribution({ buckets }: MatchDistributionProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <section className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] [animation-delay:240ms] lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Match Score Distribution</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#f2eae3]">Similarity quality across the candidate pool</h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e]">cosine similarity · 1,536-dim · ada-002</p>
      </div>

      <div className="mt-6 h-[360px] rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={buckets} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id={`distribution-fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f99c00" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00bb7f" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ffffff0a" vertical={false} />
            <XAxis
              dataKey="score"
              type="number"
              domain={[0.5, 0.95]}
              tickFormatter={(value: number) => value.toFixed(2)}
              tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "ui-monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "ui-monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "ui-monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<DistributionTooltip />} />
            <ReferenceLine
              x={0.72}
              stroke="#f99c00"
              strokeDasharray="4 4"
              label={{ value: "Threshold 0.72", fill: "#f99c00", fontSize: 11, fontFamily: "ui-monospace", position: "insideTopRight" }}
            />
            <Bar
              yAxisId="left"
              dataKey="count"
              barSize={14}
              radius={[999, 999, 0, 0]}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            >
              {buckets.map((bucket) => (
                <Cell
                  key={bucket.bucketLabel}
                  fill={bucket.score < 0.72 ? "#ffffff1a" : `url(#distribution-fill-${gradientId})`}
                />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#3080ff"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
