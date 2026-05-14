"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import type { SkillGapNode } from "./mock-data";

type SkillTreemapProps = {
  nodes: SkillGapNode[];
};

type TreemapTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: SkillGapNode;
  }>;
};

type TreemapNodeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  depth?: number;
  index?: number;
  payload?: SkillGapNode;
  name?: string;
  root?: {
    children?: SkillGapNode[];
  };
};

function TreemapTooltipContent({ active, payload }: TreemapTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-3 shadow-2xl backdrop-blur">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">{item.name}</p>
      <p className="mt-2 font-mono text-sm text-[#f2eae3]">Demand: {item.demand}</p>
      <p className="mt-1 font-mono text-sm text-[#a8a29e]">Supply: {item.supply}</p>
      <p className="mt-1 font-mono text-sm" style={{ color: item.fill }}>Gap: {item.gap}</p>
    </div>
  );
}

function TreemapNodeContent({ x, y, width, height, index, payload, root }: TreemapNodeProps) {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }

  const item = payload ?? (typeof index === "number" ? root?.children?.[index] : undefined);

  if (!item) {
    return null;
  }

  const compact = width < 90 || height < 56;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={18}
        ry={18}
        fill={item.fill}
        fillOpacity={0.16}
        stroke="rgba(255,255,255,0.08)"
      />
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(width - 2, 0)}
        height={Math.max(height - 2, 0)}
        rx={17}
        ry={17}
        fill="rgba(12,12,14,0.7)"
      />
      <foreignObject x={x + 12} y={y + 12} width={Math.max(width - 24, 0)} height={Math.max(height - 24, 0)}>
        <div className="pointer-events-none flex h-full flex-col overflow-hidden font-mono">
          <p className="truncate text-[11px] font-semibold text-[#f2eae3] lg:text-[13px]">{item.name}</p>
          {!compact ? (
            <>
              <p className="mt-2 truncate text-[11px] text-[#b8b0aa]">Demand {item.demand}</p>
              <p className="mt-1 truncate text-[12px] font-semibold" style={{ color: item.fill }}>
                Gap {item.gap}
              </p>
            </>
          ) : null}
        </div>
      </foreignObject>
    </g>
  );
}

export function SkillTreemap({ nodes }: SkillTreemapProps) {
  return (
    <section className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] [animation-delay:320ms] lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Skill Demand vs Supply</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#f2eae3]">Where the market is tightest</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00bb7f1a] bg-[#00bb7f0d] px-3 py-1 font-mono uppercase tracking-[0.2em] text-[#7ef0c8]">
            <span className="h-2 w-2 rounded-full bg-[#00bb7f]" />
            Healthy
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f99c001a] bg-[#f99c000d] px-3 py-1 font-mono uppercase tracking-[0.2em] text-[#f99c00]">
            <span className="h-2 w-2 rounded-full bg-[#f99c00]" />
            Watch
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ef44441a] bg-[#ef44440d] px-3 py-1 font-mono uppercase tracking-[0.2em] text-[#fca5a5]">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
            Critical
          </span>
        </div>
      </div>

      <div className="mt-6 h-[360px] rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={nodes}
            dataKey="size"
            stroke="#09090b"
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            content={<TreemapNodeContent />}
          >
            <Tooltip content={<TreemapTooltipContent />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
