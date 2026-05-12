import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  GitBranchPlus,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SkillMetric = {
  label: string;
  value: number;
};

const skills: SkillMetric[] = [
  { label: "Frontend Architecture", value: 88 },
  { label: "System Design", value: 81 },
  { label: "Performance", value: 84 },
  { label: "Mentoring", value: 76 },
  { label: "AI Workflow", value: 72 },
  { label: "Design Systems", value: 91 },
];

const highlights = [
  "Led a design-system migration across 14 product surfaces.",
  "Improved Web Vitals by rebuilding the rendering budget and observability loop.",
  "Mentored three engineers into feature ownership in the last two quarters.",
];

const readinessThemes = [
  { label: "Role fit", value: "88%", detail: "Strong alignment with frontend platform work." },
  { label: "Signal breadth", value: "6/6", detail: "All targeted evidence areas have portfolio proof." },
  { label: "Interview urgency", value: "High", detail: "Recommended to practice scenario-based architecture questions next." },
];

function polarPoint(index: number, total: number, value: number, radius: number, center: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const scaledRadius = (value / 100) * radius;

  return {
    x: center + Math.cos(angle) * scaledRadius,
    y: center + Math.sin(angle) * scaledRadius,
  };
}

function buildPolygon(items: SkillMetric[], scale: number, radius: number, center: number) {
  return items
    .map((item, index) => {
      const point = polarPoint(index, items.length, item.value * scale, radius, center);

      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function buildGrid(items: SkillMetric[], scale: number, radius: number, center: number) {
  return items
    .map((_, index) => {
      const point = polarPoint(index, items.length, 100 * scale, radius, center);

      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export const metadata = {
  title: "Candidate Profile",
};

export default function CandidateProfilePage() {
  const center = 160;
  const radius = 118;
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const radarPolygon = buildPolygon(skills, 1, radius, center);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <Sparkles className="size-4 text-amber-500" />
            Candidate profile
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Turn your work history into a profile that makes interview momentum obvious.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            This route gives the candidate side its own shared UI, plus a custom radar chart that visualizes how your strongest signals cluster around the target role.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-full px-5">
              <Link href="/candidate/interviews/frontend-systems">
                Review AI interview plan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full px-5">
              <Link href="/recruiter/jobs/frontend-platform/matches">See recruiter match view</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {readinessThemes.map((theme) => (
              <div key={theme.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{theme.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{theme.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{theme.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(160deg,#ffffff_0%,#ecfeff_100%)] p-6 shadow-[0_24px_60px_rgba(14,165,233,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Skill radar chart</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">Role-facing competency shape</h2>
            </div>
            <Target className="size-6 text-cyan-500" />
          </div>

          <div className="mt-6 flex justify-center">
            <svg viewBox="0 0 320 320" className="h-[320px] w-[320px] max-w-full overflow-visible">
              {gridLevels.map((level) => (
                <polygon
                  key={level}
                  points={buildGrid(skills, level, radius, center)}
                  className="fill-transparent stroke-slate-200"
                  strokeWidth="1"
                />
              ))}

              {skills.map((skill, index) => {
                const outerPoint = polarPoint(index, skills.length, 100, radius, center);

                return (
                  <g key={skill.label}>
                    <line
                      x1={center}
                      y1={center}
                      x2={outerPoint.x}
                      y2={outerPoint.y}
                      className="stroke-slate-200"
                    />
                    <text
                      x={center + (outerPoint.x - center) * 1.15}
                      y={center + (outerPoint.y - center) * 1.15}
                      className="fill-slate-500 text-[11px] font-medium"
                      textAnchor="middle"
                    >
                      {skill.label}
                    </text>
                  </g>
                );
              })}

              <polygon
                points={radarPolygon}
                className="fill-cyan-400/20 stroke-cyan-500"
                strokeWidth="3"
              />

              {skills.map((skill, index) => {
                const point = polarPoint(index, skills.length, skill.value, radius, center);

                return <circle key={skill.label} cx={point.x} cy={point.y} r="5" className="fill-cyan-500" />;
              })}
            </svg>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <BadgeCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Career highlights</p>
              <h2 className="text-2xl font-semibold text-slate-950">Evidence that supports the radar</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {highlights.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <BrainCircuit className="size-5 text-cyan-200" />
            </div>
            <div>
              <p className="text-sm text-white/55">Next best actions</p>
              <h2 className="text-2xl font-semibold">Interview readiness themes</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {skills.map((skill, index) => (
              <div key={skill.label}>
                <div className="flex items-center justify-between text-sm text-white/68">
                  <span>{skill.label}</span>
                  <span>{skill.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="animate-grow-x h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300"
                    style={{ width: `${skill.value}%`, animationDelay: `${index * 120}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-sm text-white/65">
              <GitBranchPlus className="size-4 text-amber-300" />
              AI recommendation
            </div>
            <p className="mt-3 text-base leading-7 text-white/75">
              Practice tradeoff-heavy system design questions next. That is where the recruiter brief and your current evidence overlap most strongly.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}