"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 shadow-xl">
      <p className="font-mono text-[10px] text-white/45">{payload[0].payload.skill}</p>
      <p className="font-mono text-sm font-bold" style={{ color: payload[0].color }}>
        {payload[0].value}%
      </p>
    </div>
  );
}

export function SkillRadar({ data, accentColor = "#22d3ee" }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="68%"
        data={data}
        margin={{ top: 8, right: 52, bottom: 8, left: 52 }}
      >
        <PolarGrid stroke="rgba(255,255,255,0.07)" gridType="polygon" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke={accentColor}
          fill={accentColor}
          fillOpacity={0.13}
          strokeWidth={2}
        />
        <Tooltip content={<RadarTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
