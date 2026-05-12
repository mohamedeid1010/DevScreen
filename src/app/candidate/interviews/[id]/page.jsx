import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  Code2,
  FileCode2,
  GitBranch,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    type: "Performance",
    difficulty: "Advanced",
    difficultyClass: "text-[#ff6568] border-[#ff656820] bg-[#ff65680d]",
    repo: "react-perf-toolkit",
    commitRef: "a4f3b12",
    questionTemplate:
      "In your repository {repo}, your custom `useIntersectionObserver` hook defers rendering with a 340ms debounce. The implementation reads:",
    codeSnippet: `const useIntersectionObserver = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0.1, ...options }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, 340); // ← deferral point

    return () => clearTimeout(timer);
  }, [ref, options]);

  return isVisible;
};`,
    followUp:
      "How would you generalize this deferral pattern across a multi-tenant platform where different teams control their own render budgets, and where the 340ms constant might need to be dynamically adjusted per viewport priority?",
    signal:
      "Tests whether the candidate can identify invariant assumptions in their own code and articulate the trade-offs of parameterizing timing logic in shared platform hooks.",
  },
  {
    id: 2,
    type: "Security",
    difficulty: "High",
    difficultyClass: "text-[#f99c00] border-[#f99c0020] bg-[#f99c000d]",
    repo: "devscreen-auth",
    commitRef: "c9e2a47",
    questionTemplate:
      "In commit {commitRef} of {repo}, your JWT middleware validates the token signature — but the database session lookup happens before the expiry check:",
    codeSnippet: `async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Session fetched unconditionally — before expiry check
  const session = await db.sessions.findOne({ userId: decoded.sub });

  if (Date.now() > decoded.exp * 1000) {
    return res.status(401).json({ error: 'Token expired' });
  }

  req.user = session;
  next();
}`,
    followUp:
      "Walk us through how you'd refactor this to fail fast without introducing a race condition under high concurrency, and what observability you'd add to detect future regressions of this pattern.",
    signal:
      "Surfaces security reasoning, understanding of auth flow order-of-operations, and proactive thinking about distributed system edge cases.",
  },
  {
    id: 3,
    type: "Architecture",
    difficulty: "Advanced",
    difficultyClass: "text-[#ff6568] border-[#ff656820] bg-[#ff65680d]",
    repo: "css-variables-system",
    commitRef: "f7d1c33",
    questionTemplate:
      "Your {repo} pipeline exports design tokens as CSS custom properties with this generation contract:",
    codeSnippet: `/* Auto-generated — do not edit */
:root {
  --color-primary-500: oklch(0.65 0.19 264.4);
  --color-primary-500-rgb: 59 130 246; /* alpha compositing */
  --spacing-base: 0.25rem;
  --spacing-scale: 1.618; /* golden ratio */
}

/*
  Consuming teams assume:
  - var(--color-primary-500)               → solid fills
  - rgb(var(--color-primary-500-rgb) / .8) → alpha usage
*/`,
    followUp:
      "If three product teams have built components that directly reference these token names, and your new Figma integration now generates tokens with a v2 naming schema, how do you migrate without a breaking change — and what does a deprecation boundary look like in CSS?",
    signal:
      "Tests understanding of forward/backward compatibility in shared style contracts, semantic versioning beyond JavaScript packages, and cross-team coordination overhead.",
  },
  {
    id: 4,
    type: "AI Workflow",
    difficulty: "Medium",
    difficultyClass: "text-[#f99c00] border-[#f99c0020] bg-[#f99c000d]",
    repo: "react-perf-toolkit",
    commitRef: null,
    questionTemplate:
      "Looking at your contribution history in {repo} — 73% of your PRs include explicit migration guides and breaking-change documentation. If you integrated an AI assistant into that PR workflow:",
    codeSnippet: null,
    followUp:
      "Where in that workflow would you trust AI-generated migration notes as the final output, and where would you keep human review as the mandatory gate — especially given that your token system has consumers you don't directly control?",
    signal:
      "Helps interviewers understand the candidate's risk judgment, quality standards, and practical AI adoption philosophy in a platform engineering context.",
  },
];

function renderWithBadges(text, repo, commitRef) {
  return text.split(/(\{repo\}|\{commitRef\})/g).map((segment, i) => {
    if (segment === "{repo}") {
      return (
        <span
          key={i}
          className="mx-0.5 inline-flex items-center gap-1 rounded-md border border-[#f99c0020] bg-[#f99c000d] px-1.5 py-0.5 font-mono text-xs text-[#f99c00]"
        >
          <GitBranch className="inline size-2.5" />
          {repo}
        </span>
      );
    }
    if (segment === "{commitRef}" && commitRef) {
      return (
        <span
          key={i}
          className="mx-0.5 inline-flex items-center gap-1 rounded-md border border-[#ac4bff33] bg-[#ac4bff0d] px-1.5 py-0.5 font-mono text-xs text-[#ac4bff]"
        >
          <Terminal className="inline size-2.5" />
          {commitRef}
        </span>
      );
    }
    return segment;
  });
}

function formatTrackTitle(segment) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `${formatTrackTitle(id)} Interview` };
}

export default async function InterviewQuestionsPage({ params }) {
  const { id } = await params;
  const trackTitle = formatTrackTitle(id);

  const repoSources = [
    { name: "react-perf-toolkit", commits: 143, questions: 2 },
    { name: "devscreen-auth", commits: 89, questions: 1 },
    { name: "css-variables-system", commits: 67, questions: 1 },
  ];

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
        <Button
          asChild
          variant="ghost"
          className="h-8 rounded-full px-0 text-[#a8a29e] hover:bg-transparent hover:text-[#f2eae3]"
        >
          <Link href="/candidate">
            <ArrowLeft className="size-3.5" />
            Back to profile
          </Link>
        </Button>

        <div className="mt-4 grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ac4bff33] bg-[#ac4bff0d] px-3 py-1 font-mono text-xs text-[#ac4bff]">
                <BrainCircuit className="size-3" />
                AI Interview Panel
              </span>
              <span className="rounded-full border border-[#ffffff0a] bg-[#ffffff07] px-3 py-1 font-mono text-xs text-[#a8a29e]/70">
                Code-grounded questions
              </span>
              <span className="rounded-full border border-[#ffffff0a] bg-[#ffffff07] px-3 py-1 font-mono text-xs text-[#a8a29e]/70">
                Repo-referenced
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#f2eae3] sm:text-4xl">
              Interview Kit — {trackTitle}
            </h1>
            <p className="max-w-xl text-sm leading-7 text-[#a8a29e]">
              Every question is anchored to a specific repository and — where applicable — a
              concrete code snippet extracted from the candidate&apos;s own commit history.
              Questions adapt based on detected skill vectors.
            </p>
          </div>

          <div className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
              Session Parameters
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Questions", value: `${questions.length}` },
                { label: "Est. duration", value: "38 min" },
                { label: "Repos cited", value: "3" },
                { label: "Code snippets", value: "3" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#ffffff0a] bg-[#111113] p-3"
                >
                  <p className="font-mono text-[10px] text-[#a8a29e]">{item.label}</p>
                  <p className="mt-1 font-mono text-lg font-bold text-[#f2eae3]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Questions + Sidebar ────────────────────────────────── */}
      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">

        {/* Question cards */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <article
              key={q.id}
              className="animate-rise rounded-2xl border border-[#ffffff12] bg-[#111113] p-6"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Card header */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-[#a8a29e]/40">Q{q.id}</span>
                <span className="rounded-full border border-[#ffffff0a] bg-[#ffffff07] px-2.5 py-0.5 text-xs text-[#a8a29e]">
                  {q.type}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${q.difficultyClass}`}
                >
                  {q.difficulty}
                </span>
                <div className="ml-auto flex items-center gap-1.5 rounded-full border border-[#f99c0020] bg-[#f99c000d] px-2.5 py-1">
                  <GitBranch className="size-3 text-[#f99c00]" />
                  <span className="font-mono text-[10px] text-[#f99c00]">{q.repo}</span>
                  {q.commitRef && (
                    <span className="font-mono text-[10px] text-[#a8a29e]/50">
                      #{q.commitRef}
                    </span>
                  )}
                </div>
              </div>

              {/* Question text with inline repo/commit badges */}
              <p className="text-sm leading-7 text-[#a8a29e]">
                {renderWithBadges(q.questionTemplate, q.repo, q.commitRef)}
              </p>

              {/* Code snippet */}
              {q.codeSnippet && (
                <div className="mt-4 overflow-hidden rounded-xl border border-[#ffffff0a] bg-[#0c0c0e]">
                  <div className="flex items-center gap-2 border-b border-[#ffffff0a] px-4 py-2.5">
                    <FileCode2 className="size-3.5 text-[#a8a29e]/40" />
                    <span className="font-mono text-[10px] text-[#a8a29e]/50">
                      {q.repo} · {q.commitRef ?? "main"}
                    </span>
                    <div className="ml-auto flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-[#ff6568]/35" />
                      <span className="size-2.5 rounded-full bg-[#f99c00]/35" />
                      <span className="size-2.5 rounded-full bg-[#00bb7f]/35" />
                    </div>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-[1.6] text-[#a8a29e]">
                    <code>{q.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Follow-up */}
              <div className="mt-4 rounded-xl border border-[#ac4bff1a] bg-[#ac4bff0d] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="size-3.5 text-[#ac4bff]" />
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ac4bff]/70">
                    Follow-up question
                  </p>
                </div>
                <p className="text-sm leading-6 text-[#a8a29e]">{q.followUp}</p>
              </div>

              {/* Interviewer signal */}
              <div className="mt-3 rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <BrainCircuit className="size-3 text-[#a8a29e]/40" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#a8a29e]/50">
                    Interviewer Signal
                  </p>
                </div>
                <p className="text-xs leading-5 text-[#a8a29e]/70">{q.signal}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="sticky top-24 space-y-4">

            {/* Scoring rubric */}
            <section className="rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6">
              <div className="mb-4 flex items-center gap-2">
                <Code2 className="size-4 text-[#f99c00]" />
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a8a29e]">
                  Scoring Rubric
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  "Identifies hidden assumptions in their own code without prompting.",
                  "Connects technical decisions to downstream team leverage.",
                  "Shows calibrated risk judgment when setting AI tool boundaries.",
                  "Proposes observable, measurable improvements — not just theoretical fixes.",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-[#ffffff0a] bg-[#111113] px-3 py-3"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#a8a29e]/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs leading-5 text-[#a8a29e]">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Referenced repos */}
            <section className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#a8a29e]">
                Referenced Repositories
              </p>
              <div className="space-y-2">
                {repoSources.map((repo) => (
                  <div
                    key={repo.name}
                    className="flex items-center justify-between rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="size-3 text-[#f99c00]/55" />
                      <span className="font-mono text-xs text-[#a8a29e]">{repo.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#a8a29e]/50">
                      <span>{repo.commits} commits</span>
                      <span className="rounded-full bg-[#ffffff0a] px-1.5 py-0.5">
                        {repo.questions}q
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <section className="space-y-2.5 rounded-2xl border border-[#ffffff12] bg-[#111113] p-5">
              <Button className="h-10 w-full rounded-xl text-sm">Start mock session</Button>
              <Button
                asChild
                variant="outline"
                className="h-10 w-full rounded-xl border-[#ffffff12] bg-[#0c0c0e] text-sm text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]"
              >
                <Link href="/candidate">Return to profile</Link>
              </Button>
            </section>
          </div>
        </aside>
      </section>
    </div>
  );
}
