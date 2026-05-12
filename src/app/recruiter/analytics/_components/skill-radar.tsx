"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarComparisonPoint } from "./mock-data";

type SkillRadarProps = {
  data: RadarComparisonPoint[];
};

type RadarTooltipProps = {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    value?: number;
    payload: RadarComparisonPoint;
  }>;
};

function ComparisonTooltip({ active, payload }: RadarTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0]?.payload;
  const topPerformer = payload.find((item) => item.dataKey === "topPerformer")?.value;
  const average = payload.find((item) => item.dataKey === "average")?.value;

  return (
    <div className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-3 shadow-2xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">{point.skill}</p>
      <p className="mt-2 font-mono text-sm text-[#f99c00]">Top 10%: {topPerformer}</p>
      <p className="mt-1 font-mono text-sm text-[#3080ff]">Average: {average}</p>
    </div>
  );
}

export function SkillRadar({ data }: SkillRadarProps) {
  return (
    <section className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] [animation-delay:360ms] lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Skill Radar</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#f2eae3]">Top performer signal profile</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f99c001a] bg-[#f99c000d] px-3 py-1 font-mono uppercase tracking-[0.2em] text-[#f99c00]">
            <span className="h-2 w-2 rounded-full bg-[#f99c00]" />
            Top 10%
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3080ff1a] bg-[#3080ff0d] px-3 py-1 font-mono uppercase tracking-[0.2em] text-[#93c5fd]">
            <span className="h-2 w-2 rounded-full bg-[#3080ff]" />
            Average
          </span>
        </div>
      </div>

      <div className="mt-6 h-[360px] rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="rgba(255,255,255,0.07)" gridType="polygon" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "ui-monospace" }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<ComparisonTooltip />} />
            <Radar
              name="Top 10%"
              dataKey="topPerformer"
              stroke="#f99c00"
              fill="#f99c00"
              fillOpacity={0.16}
              strokeWidth={2.5}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
            <Radar
              name="Average"
              dataKey="average"
              stroke="#3080ff"
              fill="#3080ff"
              fillOpacity={0.08}
              strokeWidth={2}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
