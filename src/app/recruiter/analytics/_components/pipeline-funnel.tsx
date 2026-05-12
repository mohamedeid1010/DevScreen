"use client";

import { useId } from "react";
import { Cell, Funnel, FunnelChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDownRight } from "lucide-react";
import type { PipelineStage } from "./mock-data";

type PipelineFunnelProps = {
  stages: PipelineStage[];
};

type FunnelTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: PipelineStage;
  }>;
};

type FunnelShapeProps = {
  x?: number;
  y?: number;
  upperWidth?: number;
  lowerWidth?: number;
  height?: number;
  fill?: string;
  payload?: PipelineStage;
};

function PremiumFunnelShape({ x, y, upperWidth, lowerWidth, height, fill, payload }: FunnelShapeProps) {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof upperWidth !== "number" ||
    typeof lowerWidth !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }

  const leftDelta = (upperWidth - lowerWidth) / 2;
  const path = [
    `M ${x} ${y}`,
    `L ${x + upperWidth} ${y}`,
    `L ${x + upperWidth - leftDelta} ${y + height}`,
    `L ${x + leftDelta} ${y + height}`,
    "Z",
  ].join(" ");

  return (
    <g>
      <path d={path} fill={fill} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {payload && upperWidth > 120 ? (
        <>
          <text x={x + 16} y={y + height / 2 - 4} fill="#f2eae3" fontSize={12} fontFamily="ui-monospace" letterSpacing="0.14em">
            {payload.stage.toUpperCase()}
          </text>
          <text x={x + 16} y={y + height / 2 + 14} fill="rgba(242,234,227,0.7)" fontSize={15} fontFamily="ui-monospace">
            {payload.value}
          </text>
        </>
      ) : null}
    </g>
  );
}

function FunnelTooltipContent({ active, payload }: FunnelTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-3 shadow-2xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">{item.stage}</p>
      <p className="mt-1 font-mono text-lg text-[#f2eae3] tabular-nums">{item.value}</p>
      <p className="mt-1 text-xs text-[#a8a29e]">{item.conversionFromPrev}% conversion from previous stage</p>
    </div>
  );
}

export function PipelineFunnel({ stages }: PipelineFunnelProps) {
  const chartId = useId().replace(/:/g, "");

  return (
    <section className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] [animation-delay:120ms] lg:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Pipeline Funnel</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#f2eae3]">From source to offer</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a8a29e]">
            Conversion holds strongest through analysis and matching, then compresses sharply once interview bandwidth becomes the limiting factor.
          </p>
        </div>
        <span className="rounded-full border border-[#ffffff12] bg-[#0c0c0e] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#a8a29e]">
          6 stages tracked
        </span>
      </div>

      <div className="mt-6 h-[340px] rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip content={<FunnelTooltipContent />} />
            <defs>
              {stages.map((stage, index) => (
                <linearGradient key={stage.stage} id={`funnel-fill-${chartId}-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={stage.fill} stopOpacity={0.96} />
                  <stop offset="100%" stopColor={stage.fill} stopOpacity={0.5} />
                </linearGradient>
              ))}
            </defs>
            <Funnel
              data={stages}
              dataKey="value"
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              shape={<PremiumFunnelShape />}
            >
              {stages.map((stage, index) => (
                <Cell key={stage.stage} fill={`url(#funnel-fill-${chartId}-${index})`} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stages.slice(1).map((stage) => (
          <div key={stage.stage} className="rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a8a29e]">{stage.stage}</p>
              <div className="inline-flex items-center gap-1 rounded-full border border-[#ffffff12] bg-[#111113] px-2.5 py-1 font-mono text-[10px] text-[#f2eae3]">
                <ArrowDownRight className="size-3" />
                {stage.conversionFromPrev}%
              </div>
            </div>
            <p className="mt-3 font-mono text-2xl text-[#f2eae3] tabular-nums">{stage.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
