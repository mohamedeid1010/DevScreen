import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Clock3,
  Layers3,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    type: "Architecture",
    difficulty: "Advanced",
    question:
      "How would you design a component platform that lets six product squads move independently without fragmenting accessibility and visual consistency?",
    signal:
      "Looks for reasoning about ownership boundaries, release strategy, and governance without slowing teams down.",
  },
  {
    type: "Performance",
    difficulty: "High",
    question:
      "Describe a time you diagnosed a frontend performance regression that was not obvious from synthetic metrics alone. What changed after you fixed it?",
    signal:
      "Surfaces whether the candidate can connect real-user pain, instrumentation, and technical execution.",
  },
  {
    type: "Leadership",
    difficulty: "Medium",
    question:
      "When a senior engineer disagrees with your platform direction but owns a critical product surface, how do you create alignment without forcing compliance?",
    signal:
      "Tests influence strategy, conflict handling, and the ability to preserve momentum across teams.",
  },
  {
    type: "AI Workflow",
    difficulty: "Medium",
    question:
      "Where would you trust AI assistance inside the frontend development loop, and where would you keep manual review as the final gate?",
    signal:
      "Helps interviewers understand judgment, risk management, and practical adoption patterns.",
  },
];

function formatTrackTitle(segment) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `${formatTrackTitle(id)} Interview`,
  };
}

export default async function InterviewQuestionsPage({ params }) {
  const { id } = await params;
  const trackTitle = formatTrackTitle(id);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#ecfeff_100%)] p-6 shadow-[0_24px_60px_rgba(14,165,233,0.1)]">
        <Button asChild variant="ghost" className="h-9 rounded-full px-0 text-slate-950 hover:bg-transparent">
          <Link href="/candidate">
            <ArrowLeft className="size-4" />
            Back to profile
          </Link>
        </Button>

        <div className="mt-4 grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm text-cyan-700">
              <BrainCircuit className="size-4" />
              AI-generated interview questions panel
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Interview kit for {trackTitle}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              This dynamic route turns the candidate context into role-specific prompts, balancing architecture depth, influence, and practical decision-making.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Interview rhythm</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: "Questions", value: "4" },
                { label: "Estimated time", value: "32 min" },
                { label: "Signal focus", value: "Architecture" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-4">
          {questions.map((item, index) => (
            <div
              key={item.question}
              className="animate-rise rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                  {item.type}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                  {item.difficulty}
                </span>
              </div>

              <p className="mt-4 text-xl font-semibold leading-8 text-slate-950">{item.question}</p>
              <div className="mt-5 rounded-[1.5rem] border border-cyan-100 bg-cyan-50/70 p-4 text-sm leading-6 text-slate-700">
                <div className="flex items-center gap-2 font-medium text-cyan-700">
                  <MessageSquareQuote className="size-4" />
                  Why this question exists
                </div>
                <p className="mt-2">{item.signal}</p>
              </div>
            </div>
          ))}
        </article>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Layers3 className="size-5 text-cyan-200" />
              </div>
              <div>
                <p className="text-sm text-white/55">Panel notes</p>
                <h2 className="text-2xl font-semibold">Scoring rubric</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                "Tradeoff clarity under changing constraints.",
                "Ability to connect technical decisions to team leverage.",
                "Evidence of measured AI usage with clear safety boundaries.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Clock3 className="size-4 text-amber-500" />
              Suggested flow
            </div>
            <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Open with architecture to anchor system depth.</li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Shift into performance evidence and concrete delivery stories.</li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Close with influence and AI-judgment questions.</li>
            </ol>

            <div className="mt-6 flex flex-col gap-3">
              <Button className="h-11 rounded-full px-5">Start mock session</Button>
              <Button asChild variant="outline" className="h-11 rounded-full px-5">
                <Link href="/candidate">
                  Return to profile
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}