"use client";

import { useId, useState } from "react";
import { DropdownMenu, Select, Tooltip } from "radix-ui";
import { Archive, ArrowDown, ArrowUp, ChevronDown, Eye, MoreHorizontal, Pause, Check } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import type { JobPerformanceRow, JobStatus } from "./mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JobsTableProps = {
  rows: JobPerformanceRow[];
};

type SortKey = "role" | "openSinceDays" | "analyzed" | "avgScore" | "shortlisted" | "status";
type SortDirection = "asc" | "desc";

const SORT_OPTIONS: Array<{ label: string; value: SortKey }> = [
  { label: "Role", value: "role" },
  { label: "Open since", value: "openSinceDays" },
  { label: "Analyzed", value: "analyzed" },
  { label: "Avg score", value: "avgScore" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Status", value: "status" },
];

function statusClasses(status: JobStatus) {
  if (status === "Hot") {
    return "border-[#f99c001a] bg-[#f99c000d] text-[#f99c00]";
  }

  if (status === "Filled") {
    return "border-[#00bb7f1a] bg-[#00bb7f0d] text-[#7ef0c8]";
  }

  if (status === "New") {
    return "border-[#3080ff1a] bg-[#3080ff0d] text-[#93c5fd]";
  }

  return "border-[#ef44441a] bg-[#ef44440d] text-[#fca5a5]";
}

function compareRows(left: JobPerformanceRow, right: JobPerformanceRow, sortKey: SortKey, direction: SortDirection) {
  const factor = direction === "asc" ? 1 : -1;

  if (sortKey === "role" || sortKey === "status") {
    return left[sortKey].localeCompare(right[sortKey]) * factor;
  }

  return (left[sortKey] - right[sortKey]) * factor;
}

function MiniScoreBar({ score }: { score: number }) {
  const gradientId = useId().replace(/:/g, "");
  const barData = [{ name: "score", value: Number((score * 100).toFixed(1)) }];

  return (
    <div className="h-6 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`score-fill-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f99c00" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#00bb7f" stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <Bar
            dataKey="value"
            fill={`url(#score-fill-${gradientId})`}
            radius={[999, 999, 999, 999]}
            background={{ fill: "rgba(255,255,255,0.06)", radius: 999 }}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function JobsTable({ rows }: JobsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("avgScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedRows = [...rows].sort((left, right) => compareRows(left, right, sortKey, sortDirection));

  function handleColumnSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "role" || nextKey === "status" ? "asc" : "desc");
  }

  return (
    <section className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-5 transition hover:border-[#ffffff1a] [animation-delay:420ms] lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">Jobs Performance</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#f2eae3]">Open roles under active analysis</h2>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="min-w-[200px]">
            <Select.Root value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
              <Select.Trigger className="inline-flex h-11 w-full items-center justify-between rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] px-4 text-sm text-[#f2eae3] outline-none transition hover:border-[#ffffff1a] focus-visible:ring-2 focus-visible:ring-[#f99c00]">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#a8a29e]">Sort: </span>
                <Select.Value />
                <Select.Icon>
                  <ChevronDown className="size-4 text-[#a8a29e]" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 overflow-hidden rounded-2xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-1 shadow-2xl backdrop-blur data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
                  <Select.Viewport className="space-y-1 p-1">
                    {SORT_OPTIONS.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        className="relative flex cursor-default items-center rounded-xl px-9 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a] data-[highlighted]:text-[#f2eae3]"
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator className="absolute left-3 inline-flex items-center">
                          <Check className="size-4 text-[#f99c00]" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#ffffff0a] bg-[#0c0c0e]">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-[#ffffff0a]">
              {[
                { label: "Role", key: "role" },
                { label: "Open since", key: "openSinceDays" },
                { label: "Analyzed", key: "analyzed" },
                { label: "Avg score", key: "avgScore" },
                { label: "Shortlisted", key: "shortlisted" },
                { label: "Status", key: "status" },
              ].map((column) => {
                const isActive = sortKey === column.key;
                const nextDirection = isActive && sortDirection === "asc" ? ArrowUp : ArrowDown;
                const SortIcon = nextDirection;

                return (
                  <th key={column.label} className="px-5 py-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[#a8a29e]">
                    <button
                      type="button"
                      onClick={() => handleColumnSort(column.key as SortKey)}
                      className="inline-flex items-center gap-2 outline-none transition hover:text-[#f2eae3] focus-visible:ring-2 focus-visible:ring-[#f99c00]"
                    >
                      {column.label}
                      {isActive ? <SortIcon className="size-3.5 text-[#f99c00]" /> : null}
                    </button>
                  </th>
                );
              })}
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id} className="group border-b border-[#ffffff0a] transition hover:bg-[#17171a]">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-[#f2eae3]">{row.role}</p>
                    <p className="mt-1 text-sm text-[#a8a29e]">{row.region} · {row.seniority}</p>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-sm text-[#d8d0ca] tabular-nums">{row.openSinceDays}d</td>
                <td className="px-5 py-4 font-mono text-sm text-[#d8d0ca] tabular-nums">{row.analyzed}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <MiniScoreBar score={row.avgScore} />
                    <span className="font-mono text-sm text-[#f2eae3] tabular-nums">{row.avgScore.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-sm text-[#d8d0ca] tabular-nums">{row.shortlisted}</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]", statusClasses(row.status))}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#ffffff12] bg-[#111113] text-[#f2eae3] outline-none transition hover:border-[#ffffff1a] hover:bg-[#17171a] focus-visible:ring-2 focus-visible:ring-[#f99c00]"
                          aria-label="View role"
                        >
                          <Eye className="size-4" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="rounded-xl border border-[#ffffff12] bg-[#0c0c0e]/95 px-3 py-2 font-mono text-[11px] text-[#f2eae3] shadow-2xl backdrop-blur">
                          View role
                          <Tooltip.Arrow className="fill-[#0c0c0e]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#ffffff12] bg-[#111113] text-[#f2eae3] outline-none transition hover:border-[#ffffff1a] hover:bg-[#17171a] focus-visible:ring-2 focus-visible:ring-[#f99c00]"
                          aria-label="Open role actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="z-50 min-w-[180px] rounded-2xl border border-[#ffffff12] bg-[#0c0c0e]/95 p-1 shadow-2xl backdrop-blur data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95" sideOffset={8}>
                          <DropdownMenu.Item className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a]">
                            <Eye className="size-4" />
                            View
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#f2eae3] outline-none transition data-[highlighted]:bg-[#17171a]">
                            <Pause className="size-4" />
                            Pause
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[#fca5a5] outline-none transition data-[highlighted]:bg-[#17171a]">
                            <Archive className="size-4" />
                            Archive
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
