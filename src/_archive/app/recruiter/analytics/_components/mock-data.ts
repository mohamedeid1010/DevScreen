export type TimeRange = "24h" | "7d" | "30d" | "90d" | "ytd";

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaDirection: "up" | "down";
  accentColor: string;
  accentTint: string;
  description: string;
  hoverTitle: string;
  hoverBody: string;
  sparkline: Array<{
    step: string;
    value: number;
  }>;
};

export type PipelineStage = {
  stage: string;
  value: number;
  fill: string;
  conversionFromPrev: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  role: string;
  seniority: string;
  region: string;
  minutesAgo: number;
  tone: "positive" | "info" | "warning";
};

export type MatchDistributionBucket = {
  bucketLabel: string;
  score: number;
  count: number;
  cumulative: number;
};

export type SkillGapNode = {
  name: string;
  size: number;
  demand: number;
  supply: number;
  gap: number;
  severity: "healthy" | "watch" | "critical";
  fill: string;
};

export type RadarComparisonPoint = {
  skill: string;
  topPerformer: number;
  average: number;
};

export type JobStatus = "Hot" | "Stalled" | "Filled" | "New";

export type JobPerformanceRow = {
  id: string;
  role: string;
  openSinceDays: number;
  analyzed: number;
  avgScore: number;
  shortlisted: number;
  status: JobStatus;
  region: string;
  seniority: string;
};

export type InsightItem = {
  id: string;
  headline: string;
  message: string;
  supportLabel: string;
  supportValue: string;
};

export type AnalyticsSnapshot = {
  kpis: KpiMetric[];
  pipeline: PipelineStage[];
  activity: ActivityItem[];
  distribution: MatchDistributionBucket[];
  skillDemand: SkillGapNode[];
  radar: RadarComparisonPoint[];
  jobs: JobPerformanceRow[];
  insights: InsightItem[];
};

export const TIME_RANGE_OPTIONS: Array<{ label: string; value: TimeRange }> = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "YTD", value: "ytd" },
];

export const ROLE_FILTER_OPTIONS = [
  "All roles",
  "Frontend Platform Engineer",
  "Staff AI Recruiter",
  "Security Platform Lead",
  "Data Infrastructure Engineer",
] as const;

export const SENIORITY_FILTER_OPTIONS = ["All seniority", "Mid", "Senior", "Staff", "Lead"] as const;

export const REGION_FILTER_OPTIONS = ["All regions", "EMEA", "NA", "Remote", "Hybrid"] as const;

export type RoleFilter = (typeof ROLE_FILTER_OPTIONS)[number];
export type SeniorityFilter = (typeof SENIORITY_FILTER_OPTIONS)[number];
export type RegionFilter = (typeof REGION_FILTER_OPTIONS)[number];

const BASE_KPIS: KpiMetric[] = [
  {
    id: "avg-match",
    label: "AVG MATCH CONFIDENCE",
    value: "87.3%",
    delta: "4.2%",
    deltaDirection: "up",
    accentColor: "#f99c00",
    accentTint: "#f99c000d",
    description: "Across shortlisted candidates in the current recruiter window.",
    hoverTitle: "Confidence trend",
    hoverBody: "Confidence rose as React, TypeScript, and systems-design signals started co-occurring in the same top quartile of candidates.",
    sparkline: [
      { step: "W1", value: 72 },
      { step: "W2", value: 75 },
      { step: "W3", value: 74 },
      { step: "W4", value: 78 },
      { step: "W5", value: 81 },
      { step: "W6", value: 84 },
      { step: "W7", value: 87.3 },
    ],
  },
  {
    id: "shortlist-time",
    label: "TIME-TO-SHORTLIST",
    value: "38 min",
    delta: "11.8%",
    deltaDirection: "up",
    accentColor: "#00bb7f",
    accentTint: "#00bb7f0d",
    description: "Median time from job brief publish to recruiter-ready shortlist.",
    hoverTitle: "Time compression",
    hoverBody: "The latest routing trims manual review by weighting repo graph quality before semantic reranking kicks in.",
    sparkline: [
      { step: "W1", value: 62 },
      { step: "W2", value: 58 },
      { step: "W3", value: 54 },
      { step: "W4", value: 49 },
      { step: "W5", value: 46 },
      { step: "W6", value: 42 },
      { step: "W7", value: 38 },
    ],
  },
  {
    id: "active-candidates",
    label: "ACTIVE CANDIDATES",
    value: "1,284",
    delta: "8.7%",
    deltaDirection: "up",
    accentColor: "#3080ff",
    accentTint: "#3080ff0d",
    description: "Profiles currently scoring above passive ingestion thresholds.",
    hoverTitle: "Candidate flow",
    hoverBody: "GitHub refreshes and newly published roles pushed another 103 candidates into the analyzable cohort this month.",
    sparkline: [
      { step: "W1", value: 960 },
      { step: "W2", value: 1018 },
      { step: "W3", value: 1094 },
      { step: "W4", value: 1132 },
      { step: "W5", value: 1184 },
      { step: "W6", value: 1238 },
      { step: "W7", value: 1284 },
    ],
  },
  {
    id: "offer-rate",
    label: "INTERVIEW-TO-OFFER",
    value: "41%",
    delta: "3.1%",
    deltaDirection: "up",
    accentColor: "#ac4bff",
    accentTint: "#ac4bff0d",
    description: "Offer conversion for candidates that crossed the 0.72 similarity bar.",
    hoverTitle: "Offer momentum",
    hoverBody: "Offer efficiency improved after the shortlist concentrated on candidates with stronger collaboration and documentation signals.",
    sparkline: [
      { step: "W1", value: 28 },
      { step: "W2", value: 31 },
      { step: "W3", value: 33 },
      { step: "W4", value: 35 },
      { step: "W5", value: 37 },
      { step: "W6", value: 39 },
      { step: "W7", value: 41 },
    ],
  },
];

const BASE_PIPELINE: PipelineStage[] = [
  { stage: "Sourced", value: 1824, fill: "#f99c00", conversionFromPrev: 100 },
  { stage: "Analyzed", value: 1460, fill: "#efb10f", conversionFromPrev: 80.1 },
  { stage: "Matched", value: 1142, fill: "#d4b51c", conversionFromPrev: 78.2 },
  { stage: "Shortlisted", value: 624, fill: "#6dc468", conversionFromPrev: 54.6 },
  { stage: "Interviewed", value: 268, fill: "#3080ff", conversionFromPrev: 42.9 },
  { stage: "Offered", value: 110, fill: "#ac4bff", conversionFromPrev: 41 },
];

const BASE_ACTIVITY: ActivityItem[] = [
  {
    id: "evt-1",
    title: "New match 0.91",
    detail: "Frontend Platform Engineer",
    role: "Frontend Platform Engineer",
    seniority: "Staff",
    region: "EMEA",
    minutesAgo: 3,
    tone: "positive",
  },
  {
    id: "evt-2",
    title: "AI rerank completed",
    detail: "Security Platform Lead",
    role: "Security Platform Lead",
    seniority: "Lead",
    region: "NA",
    minutesAgo: 8,
    tone: "info",
  },
  {
    id: "evt-3",
    title: "Threshold crossed 0.84",
    detail: "Staff AI Recruiter",
    role: "Staff AI Recruiter",
    seniority: "Senior",
    region: "Remote",
    minutesAgo: 14,
    tone: "positive",
  },
  {
    id: "evt-4",
    title: "New GitHub sync ingested",
    detail: "Data Infrastructure Engineer",
    role: "Data Infrastructure Engineer",
    seniority: "Senior",
    region: "Hybrid",
    minutesAgo: 19,
    tone: "info",
  },
  {
    id: "evt-5",
    title: "Pipeline stalled warning",
    detail: "Design Systems Lead",
    role: "Frontend Platform Engineer",
    seniority: "Lead",
    region: "EMEA",
    minutesAgo: 27,
    tone: "warning",
  },
  {
    id: "evt-6",
    title: "Shortlist exported",
    detail: "Platform reliability sweep",
    role: "Security Platform Lead",
    seniority: "Staff",
    region: "Remote",
    minutesAgo: 34,
    tone: "info",
  },
  {
    id: "evt-7",
    title: "Offer stage entered",
    detail: "Backend observability cohort",
    role: "Data Infrastructure Engineer",
    seniority: "Senior",
    region: "NA",
    minutesAgo: 44,
    tone: "positive",
  },
  {
    id: "evt-8",
    title: "Search radius broadened",
    detail: "Kafka-adjacent backend signals",
    role: "Staff AI Recruiter",
    seniority: "Mid",
    region: "EMEA",
    minutesAgo: 58,
    tone: "warning",
  },
];

const DISTRIBUTION_COUNTS = [2, 4, 6, 8, 11, 17, 22, 29, 38, 48, 61, 74, 86, 98, 91, 79, 63, 44, 28, 16] as const;

const BASE_SKILL_DEMAND: SkillGapNode[] = [
  { name: "React", size: 84, demand: 148, supply: 124, gap: 24, severity: "watch", fill: "#f99c00" },
  { name: "Rust", size: 56, demand: 94, supply: 43, gap: 51, severity: "critical", fill: "#ef4444" },
  { name: "K8s", size: 61, demand: 110, supply: 78, gap: 32, severity: "watch", fill: "#f99c00" },
  { name: "Postgres", size: 44, demand: 82, supply: 74, gap: 8, severity: "healthy", fill: "#00bb7f" },
  { name: "TS", size: 93, demand: 166, supply: 148, gap: 18, severity: "healthy", fill: "#00bb7f" },
  { name: "Go", size: 52, demand: 96, supply: 59, gap: 37, severity: "watch", fill: "#f99c00" },
  { name: "GraphQL", size: 38, demand: 71, supply: 50, gap: 21, severity: "watch", fill: "#f99c00" },
  { name: "Terraform", size: 47, demand: 80, supply: 42, gap: 38, severity: "critical", fill: "#ef4444" },
  { name: "Python", size: 73, demand: 132, supply: 118, gap: 14, severity: "healthy", fill: "#00bb7f" },
  { name: "Solidity", size: 28, demand: 48, supply: 17, gap: 31, severity: "critical", fill: "#ef4444" },
];

const BASE_RADAR: RadarComparisonPoint[] = [
  { skill: "Code quality", topPerformer: 92, average: 71 },
  { skill: "Velocity", topPerformer: 88, average: 66 },
  { skill: "Collaboration", topPerformer: 84, average: 63 },
  { skill: "Architecture", topPerformer: 95, average: 68 },
  { skill: "Testing", topPerformer: 89, average: 61 },
  { skill: "Documentation", topPerformer: 82, average: 58 },
];

const BASE_JOBS: JobPerformanceRow[] = [
  {
    id: "job-1",
    role: "Frontend Platform Engineer",
    openSinceDays: 12,
    analyzed: 328,
    avgScore: 0.87,
    shortlisted: 18,
    status: "Hot",
    region: "EMEA",
    seniority: "Staff",
  },
  {
    id: "job-2",
    role: "Security Platform Lead",
    openSinceDays: 21,
    analyzed: 214,
    avgScore: 0.79,
    shortlisted: 9,
    status: "Stalled",
    region: "NA",
    seniority: "Lead",
  },
  {
    id: "job-3",
    role: "Data Infrastructure Engineer",
    openSinceDays: 8,
    analyzed: 188,
    avgScore: 0.83,
    shortlisted: 14,
    status: "New",
    region: "Hybrid",
    seniority: "Senior",
  },
  {
    id: "job-4",
    role: "Staff AI Recruiter",
    openSinceDays: 34,
    analyzed: 146,
    avgScore: 0.76,
    shortlisted: 6,
    status: "Filled",
    region: "Remote",
    seniority: "Senior",
  },
  {
    id: "job-5",
    role: "Design Systems Lead",
    openSinceDays: 29,
    analyzed: 196,
    avgScore: 0.74,
    shortlisted: 7,
    status: "Stalled",
    region: "EMEA",
    seniority: "Lead",
  },
  {
    id: "job-6",
    role: "Developer Experience Architect",
    openSinceDays: 5,
    analyzed: 124,
    avgScore: 0.82,
    shortlisted: 11,
    status: "Hot",
    region: "Remote",
    seniority: "Staff",
  },
];

const BASE_INSIGHTS: InsightItem[] = [
  {
    id: "insight-1",
    headline: "AI INSIGHT",
    message:
      "3 of your 5 stalled roles share a distributed systems skill gap. Broadening the radius to include backend candidates with Kafka signals could surface 47 additional matches above the 0.72 threshold.",
    supportLabel: "Projected uplift",
    supportValue: "+47 matches",
  },
  {
    id: "insight-2",
    headline: "AI INSIGHT",
    message:
      "Candidates who score above 0.84 on architecture and documentation are reaching shortlist 19 minutes faster than the rest of the pool. Tightening the first-pass weight on those signals should reduce manual review churn.",
    supportLabel: "Review time saved",
    supportValue: "19 min",
  },
  {
    id: "insight-3",
    headline: "AI INSIGHT",
    message:
      "Your hottest role is over-indexing on React and design-system evidence while under-weighting mentoring signals. Adjusting the reranker could shift 6 currently-hidden staff candidates into view.",
    supportLabel: "Hidden candidates",
    supportValue: "6 surfaced",
  },
];

const RANGE_KPI_OVERRIDES: Record<TimeRange, Array<Pick<KpiMetric, "value" | "delta">>> = {
  "24h": [
    { value: "85.9%", delta: "1.4%" },
    { value: "44 min", delta: "4.1%" },
    { value: "1,102", delta: "2.6%" },
    { value: "38%", delta: "1.2%" },
  ],
  "7d": [
    { value: "86.8%", delta: "2.9%" },
    { value: "41 min", delta: "7.4%" },
    { value: "1,196", delta: "5.1%" },
    { value: "40%", delta: "2.4%" },
  ],
  "30d": [
    { value: "87.3%", delta: "4.2%" },
    { value: "38 min", delta: "11.8%" },
    { value: "1,284", delta: "8.7%" },
    { value: "41%", delta: "3.1%" },
  ],
  "90d": [
    { value: "84.7%", delta: "6.8%" },
    { value: "52 min", delta: "14.3%" },
    { value: "1,842", delta: "13.6%" },
    { value: "36%", delta: "4.9%" },
  ],
  ytd: [
    { value: "83.5%", delta: "9.4%" },
    { value: "57 min", delta: "18.2%" },
    { value: "2,406", delta: "21.7%" },
    { value: "34%", delta: "6.3%" },
  ],
};

function buildDistributionBuckets(counts: readonly number[]): MatchDistributionBucket[] {
  let runningTotal = 0;

  return counts.map((count, index) => {
    const score = 0.5 + index * 0.0225;
    runningTotal += count;

    return {
      bucketLabel: `${score.toFixed(2)}-${(score + 0.02).toFixed(2)}`,
      score: Number(score.toFixed(3)),
      count,
      cumulative: runningTotal,
    };
  });
}

function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}

export async function getAnalyticsSnapshot(range: TimeRange): Promise<AnalyticsSnapshot> {
  await sleep(400);

  const overrides = RANGE_KPI_OVERRIDES[range];

  return {
    kpis: BASE_KPIS.map((metric, index) => ({
      ...metric,
      value: overrides[index]?.value ?? metric.value,
      delta: overrides[index]?.delta ?? metric.delta,
    })),
    pipeline: BASE_PIPELINE,
    activity: BASE_ACTIVITY,
    distribution: buildDistributionBuckets(DISTRIBUTION_COUNTS),
    skillDemand: BASE_SKILL_DEMAND,
    radar: BASE_RADAR,
    jobs: BASE_JOBS,
    insights: BASE_INSIGHTS,
  };
}
