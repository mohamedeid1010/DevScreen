"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkillBreakdown } from "@/lib/types";

const SKILL_LABELS: Record<keyof SkillBreakdown, string> = {
  frontend: "Frontend",
  backend: "Backend",
  testing: "Testing",
  devops: "DevOps",
  architecture: "Architecture",
  documentation: "Docs",
};

type Props = {
  data: SkillBreakdown;
  size?: "sm" | "lg";
};

export default function SkillRadarChart({ data, size = "lg" }: Props) {
  const chartData = Object.entries(SKILL_LABELS).map(([key, label]) => ({
    skill: label,
    value: data[key as keyof SkillBreakdown] ?? 0,
    fullMark: 100,
  }));

  const height = size === "sm" ? 200 : 320;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius={size === "sm" ? "70%" : "75%"} data={chartData}>
        <PolarGrid stroke="#ffffff12" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "#a8a29e", fontSize: size === "sm" ? 10 : 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "#6b6670", fontSize: 10 }}
          tickCount={5}
        />
        <Radar
          name="Skill"
          dataKey="value"
          stroke="#e4002b"
          fill="#e4002b"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "#111113",
            border: "1px solid #ffffff18",
            borderRadius: "8px",
            color: "#f2eae3",
            fontSize: "13px",
          }}
          formatter={(value) => [`${value}/100`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
