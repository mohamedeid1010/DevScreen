export type FitBand = "Strong fit" | "Good fit" | "Needs review";

export type RadarPoint = {
  skill: string;
  value: number;
};

export type DemoLanguageSignal = {
  name: string;
  emphasis: string;
  width: number;
  color: string;
};

export type DemoProfileSignal = {
  label: string;
  value: string;
  detail: string;
};

export type DemoRepository = {
  name: string;
  summary: string;
  signal: string;
  focus: string;
};

export type DemoInterviewQuestion = {
  id: number;
  type: string;
  difficulty: string;
  prompt: string;
  followUp: string;
  signal: string;
  repo: string;
  codeSnippet?: string;
};

export type DemoInterviewKit = {
  title: string;
  summary: string;
  questions: DemoInterviewQuestion[];
  repoSources: Array<{
    name: string;
    note: string;
  }>;
};

export type DemoCandidateProfile = {
  id: string;
  name: string;
  initials: string;
  location: string;
  githubHandle: string;
  headline: string;
  stage: string;
  strengths: string[];
  watchouts: string[];
  focusAreas: string[];
  radarData: RadarPoint[];
  signalReadouts: Array<{
    label: string;
    value: string;
    explanation: string;
  }>;
  profileSignals: DemoProfileSignal[];
  languages: DemoLanguageSignal[];
  topRepos: DemoRepository[];
  activitySummary: string;
  readiness: Array<{
    label: string;
    value: string;
    sub: string;
  }>;
  interviewKit: DemoInterviewKit;
};

export type DemoMatchSummary = {
  id: string;
  name: string;
  initials: string;
  location: string;
  fitBand: FitBand;
  stage: string;
  topRepo: string;
  matchSummary: string;
  strengths: string[];
  watchouts: string[];
  radarData: RadarPoint[];
  signalReadouts: Array<{
    label: string;
    value: string;
    explanation: string;
  }>;
};

export type DemoJobDraft = {
  title: string;
  location: string;
  seniority: string;
  hiringManager: string;
  roleBrief: string;
  mustHaveTechnologies: string;
  interviewBrief: string;
  slug: string;
};

export type ActiveDemoSession = {
  job: DemoJobDraft;
  featuredCandidateId: string;
  matches: DemoMatchSummary[];
  updatedAt: string;
};

export function slugifyJobTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "role-demo";
}

export function formatRoleTitleFromSlug(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createDemoJobDraft(input: Partial<Omit<DemoJobDraft, "slug">> & { slug?: string }): DemoJobDraft {
  const title = input.title?.trim() || "Frontend Platform Engineer";

  return {
    title,
    location: input.location?.trim() || "Cairo, Hybrid",
    seniority: input.seniority?.trim() || "Senior",
    hiringManager: input.hiringManager?.trim() || "Sara Ibrahim",
    roleBrief:
      input.roleBrief?.trim() ||
      "Own the frontend platform roadmap, raise engineering leverage through design systems, and keep interview stories tied to real implementation evidence.",
    mustHaveTechnologies:
      input.mustHaveTechnologies?.trim() ||
      "React 19, Next.js 16, design systems, performance profiling, mentoring",
    interviewBrief:
      input.interviewBrief?.trim() ||
      "Generate scenario-based interview prompts around architecture tradeoffs, coaching style, and experimentation discipline.",
    slug: input.slug?.trim() || slugifyJobTitle(title),
  };
}

export const DEFAULT_DEMO_JOB = createDemoJobDraft({
  title: "Frontend Platform Engineer",
  location: "Cairo, Hybrid",
  seniority: "Senior",
  hiringManager: "Sara Ibrahim",
  roleBrief:
    "Own the frontend platform roadmap, raise engineering leverage through design systems, and keep interview stories tied to real implementation evidence.",
  mustHaveTechnologies:
    "React 19, Next.js 16, design systems, performance profiling, mentoring",
  interviewBrief:
    "Generate scenario-based interview prompts around architecture tradeoffs, coaching style, and experimentation discipline.",
});

const SEEDED_CANDIDATES: DemoCandidateProfile[] = [
  {
    id: "nora-salem",
    name: "Nora Salem",
    initials: "NS",
    location: "Cairo · Hybrid",
    githubHandle: "norasalem",
    headline: "Demo candidate with strong platform and design-system evidence.",
    stage: "Best demo candidate for a platform-focused loop",
    strengths: ["React platform ownership", "Design system stewardship", "Performance budgets", "Mentoring rituals"],
    watchouts: ["Needs peers who enjoy platform reviews"],
    focusAreas: ["react", "frontend", "next", "design system", "performance", "platform", "mentoring"],
    radarData: [
      { skill: "Code Modularity", value: 91 },
      { skill: "Security Awareness", value: 76 },
      { skill: "Test Coverage", value: 84 },
      { skill: "API Design", value: 88 },
      { skill: "Performance Opt.", value: 93 },
      { skill: "Documentation", value: 81 },
    ],
    signalReadouts: [
      {
        label: "Technical depth",
        value: "Strong fit",
        explanation: "The seeded repos emphasize architecture cleanup, migration guidance, and runtime performance patterns.",
      },
      {
        label: "Execution range",
        value: "Strong fit",
        explanation: "The story stays consistent across product work, platform maintenance, and enablement work.",
      },
      {
        label: "Leadership fit",
        value: "Good fit",
        explanation: "Mentoring and rollout habits are visible, but the sample still benefits from final-loop calibration.",
      },
    ],
    profileSignals: [
      {
        label: "Portfolio depth",
        value: "Broad repo signal",
        detail: "Seeded samples span runtime tooling, auth, and design-token systems.",
      },
      {
        label: "Delivery cadence",
        value: "Consistent shipping",
        detail: "The mock contribution story favors steady iteration over bursty output.",
      },
      {
        label: "Platform scope",
        value: "Cross-team ownership",
        detail: "The strongest examples all show shared contracts and migration planning.",
      },
      {
        label: "Interview posture",
        value: "Panel-ready demo",
        detail: "The same seeded evidence can support recruiter review and candidate prep.",
      },
    ],
    languages: [
      { name: "TypeScript", emphasis: "Primary", width: 76, color: "#3080ff" },
      { name: "JavaScript", emphasis: "Supporting", width: 54, color: "#f99c00" },
      { name: "Python", emphasis: "Working", width: 28, color: "#00bb7f" },
      { name: "CSS / SCSS", emphasis: "Primary", width: 61, color: "#ac4bff" },
    ],
    topRepos: [
      {
        name: "react-perf-toolkit",
        summary: "Seeded repo that demonstrates render-budget tooling and shared hook patterns for React teams.",
        signal: "High leverage sample",
        focus: "Performance budgets, migration safety, and platform guardrails.",
      },
      {
        name: "devscreen-auth",
        summary: "Demo auth surface used to discuss sequencing, session hygiene, and reviewer empathy.",
        signal: "Good systems sample",
        focus: "Operational order-of-operations and safe defaults.",
      },
      {
        name: "css-variables-system",
        summary: "Shared token pipeline used as the design-system and deprecation story anchor.",
        signal: "Cross-team sample",
        focus: "Naming contracts, rollout paths, and UI governance.",
      },
    ],
    activitySummary:
      "The seeded commit pattern tells a stable story: platform work, documentation, and migration-minded changes show up together instead of as isolated spikes.",
    readiness: [
      {
        label: "Role fit",
        value: "Strong fit",
        sub: "Best when the brief mentions platform stewardship, design systems, or frontend performance.",
      },
      {
        label: "Signal coverage",
        value: "Well-supported",
        sub: "Every talking point on the recruiter side has a matching repo or workflow example.",
      },
      {
        label: "Interview priority",
        value: "Worth a loop",
        sub: "Architecture tradeoffs and coaching habits are the best next questions.",
      },
    ],
    interviewKit: {
      title: "Sample generated interview kit",
      summary:
        "A recruiter-facing demo kit for platform-heavy roles that keeps every question tied to the same seeded repositories and reasoning.",
      repoSources: [
        { name: "react-perf-toolkit", note: "Performance and platform ownership sample." },
        { name: "devscreen-auth", note: "Order-of-operations and security judgment sample." },
        { name: "css-variables-system", note: "Design-system migration sample." },
      ],
      questions: [
        {
          id: 1,
          type: "Performance",
          difficulty: "Stretch",
          repo: "react-perf-toolkit",
          prompt:
            "This sample repo defers some render work behind a shared visibility hook. Where would you keep the hook generic, and where would you let product teams tune the behavior?",
          followUp:
            "Describe the review signals you would expect before rolling that pattern across multiple teams.",
          signal:
            "Checks whether the candidate can connect platform defaults to real delivery constraints.",
          codeSnippet: `const useVisibilityBudget = (ref, config = {}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.1, ...config });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, config]);

  return visible;
};`,
        },
        {
          id: 2,
          type: "Architecture",
          difficulty: "Core",
          repo: "css-variables-system",
          prompt:
            "Three teams depend on your token names, and design now wants a v2 naming scheme. How would you keep the migration readable for teams that did not build the original system?",
          followUp:
            "Explain what a safe deprecation boundary looks like when the contract is CSS rather than TypeScript.",
          signal:
            "Shows whether the candidate can balance shared-system evolution with consumer trust.",
        },
        {
          id: 3,
          type: "Security",
          difficulty: "Core",
          repo: "devscreen-auth",
          prompt:
            "This auth sample fetches session state before every early-exit condition. What would you change first, and how would you prove the change did not regress operator visibility?",
          followUp:
            "Tell us which logs or traces you would keep after simplifying the middleware path.",
          signal:
            "Highlights judgment about fail-fast behavior, observability, and calm system design.",
        },
      ],
    },
  },
  {
    id: "karim-adel",
    name: "Karim Adel",
    initials: "KA",
    location: "Alexandria · Remote",
    githubHandle: "karimadel",
    headline: "Demo candidate whose best examples are backend observability and migration work.",
    stage: "Strong backup for systems-heavy or security-heavy briefs",
    strengths: ["Observability habits", "Migration planning", "Backend reliability", "Operational calm"],
    watchouts: ["Less coaching evidence than the featured profile"],
    focusAreas: ["node", "observability", "security", "backend", "migration", "reliability"],
    radarData: [
      { skill: "Code Modularity", value: 82 },
      { skill: "Security Awareness", value: 90 },
      { skill: "Test Coverage", value: 79 },
      { skill: "API Design", value: 85 },
      { skill: "Performance Opt.", value: 74 },
      { skill: "Documentation", value: 73 },
    ],
    signalReadouts: [
      {
        label: "Technical depth",
        value: "Good fit",
        explanation: "The repo samples skew toward backend reliability and security-minded sequencing.",
      },
      {
        label: "Execution range",
        value: "Good fit",
        explanation: "The seeded story is strongest when the role cares about resilience and migration plans.",
      },
      {
        label: "Leadership fit",
        value: "Needs review",
        explanation: "The demo contains fewer mentoring and enablement moments than the featured profile.",
      },
    ],
    profileSignals: [
      {
        label: "Portfolio depth",
        value: "Focused systems signal",
        detail: "Examples stay close to reliability, auth, and debugging surfaces.",
      },
      {
        label: "Delivery cadence",
        value: "Steady operations",
        detail: "The mock history emphasizes safer rollouts over flashy feature volume.",
      },
      {
        label: "Platform scope",
        value: "Service-oriented",
        detail: "Best match when the role values middleware quality and infrastructure empathy.",
      },
      {
        label: "Interview posture",
        value: "Worth comparison",
        detail: "Good contrast candidate for platform roles that blend frontend and backend ownership.",
      },
    ],
    languages: [
      { name: "TypeScript", emphasis: "Primary", width: 68, color: "#3080ff" },
      { name: "Node", emphasis: "Primary", width: 71, color: "#f99c00" },
      { name: "SQL", emphasis: "Supporting", width: 43, color: "#00bb7f" },
      { name: "Shell", emphasis: "Working", width: 26, color: "#ac4bff" },
    ],
    topRepos: [
      {
        name: "node-observability",
        summary: "Seeded service repo that supports alert hygiene, diagnostics, and debugging tradeoffs.",
        signal: "Reliability sample",
        focus: "Tracing quality and operational storytelling.",
      },
      {
        name: "session-guard",
        summary: "Middleware sample used to discuss auth boundaries and concurrency-aware failure modes.",
        signal: "Security sample",
        focus: "Ordering checks and safe request handling.",
      },
      {
        name: "migration-notes",
        summary: "Internal tooling sample centered on rollout communication and guardrail docs.",
        signal: "Change-management sample",
        focus: "Safe defaults and operator empathy.",
      },
    ],
    activitySummary:
      "The seeded timeline reads like someone who prefers clean migrations, stable alerts, and predictable systems behavior over broad product experimentation.",
    readiness: [
      {
        label: "Role fit",
        value: "Good fit",
        sub: "Most persuasive when the role mentions auth, observability, or backend quality.",
      },
      {
        label: "Signal coverage",
        value: "Narrow but clear",
        sub: "The evidence is consistent, but less broad than the featured platform profile.",
      },
      {
        label: "Interview priority",
        value: "Needs comparison",
        sub: "Useful as a contrast candidate when you want to compare frontend depth to systems depth.",
      },
    ],
    interviewKit: {
      title: "Sample generated interview kit",
      summary:
        "A seeded kit focused on auth flow ordering, observability, and migration planning.",
      repoSources: [
        { name: "node-observability", note: "Alerting and debugging sample." },
        { name: "session-guard", note: "Middleware and session ordering sample." },
      ],
      questions: [
        {
          id: 1,
          type: "Security",
          difficulty: "Core",
          repo: "session-guard",
          prompt:
            "In this middleware sample, where would you draw the line between fast rejection and richer audit signals?",
          followUp:
            "Explain the tradeoff if the system is under load and you need to protect downstream stores.",
          signal:
            "Reveals how the candidate balances security flow order with operational diagnostics.",
        },
        {
          id: 2,
          type: "Operations",
          difficulty: "Stretch",
          repo: "node-observability",
          prompt:
            "A dashboard shows noisy alerts after a rollout. Which signals do you keep, which do you tune, and what would you tell the team first?",
          followUp:
            "Describe the smallest change you would make before touching alert thresholds globally.",
          signal:
            "Tests operational calm and prioritization under ambiguity.",
        },
      ],
    },
  },
  {
    id: "mariam-tarek",
    name: "Mariam Tarek",
    initials: "MT",
    location: "Dubai · Hybrid",
    githubHandle: "mariamtarek",
    headline: "Demo candidate that reads strongest in testing discipline and cross-platform execution.",
    stage: "Good comparison for quality-heavy or cross-platform roles",
    strengths: ["Testing discipline", "Cross-platform thinking", "Release quality", "Team handoff clarity"],
    watchouts: ["Less evidence around pure platform governance"],
    focusAreas: ["testing", "cross-platform", "mobile", "quality", "release", "qa"],
    radarData: [
      { skill: "Code Modularity", value: 78 },
      { skill: "Security Awareness", value: 71 },
      { skill: "Test Coverage", value: 92 },
      { skill: "API Design", value: 76 },
      { skill: "Performance Opt.", value: 72 },
      { skill: "Documentation", value: 83 },
    ],
    signalReadouts: [
      {
        label: "Technical depth",
        value: "Good fit",
        explanation: "The seeded story leans into quality systems rather than platform architecture alone.",
      },
      {
        label: "Execution range",
        value: "Strong fit",
        explanation: "Release coordination, testing, and cross-platform clarity show up consistently.",
      },
      {
        label: "Leadership fit",
        value: "Good fit",
        explanation: "The examples suggest clean handoffs, but less emphasis on shared platform mandates.",
      },
    ],
    profileSignals: [
      {
        label: "Portfolio depth",
        value: "Quality-led signal",
        detail: "The strongest repos revolve around test confidence and release discipline.",
      },
      {
        label: "Delivery cadence",
        value: "Deliberate shipping",
        detail: "The mock history favors regressions avoided over raw speed.",
      },
      {
        label: "Platform scope",
        value: "Cross-surface thinking",
        detail: "Best fit when the role needs alignment across web and adjacent clients.",
      },
      {
        label: "Interview posture",
        value: "Scenario-ready",
        detail: "Useful when the panel wants release, QA, and risk conversations.",
      },
    ],
    languages: [
      { name: "TypeScript", emphasis: "Primary", width: 64, color: "#3080ff" },
      { name: "React Native", emphasis: "Primary", width: 66, color: "#f99c00" },
      { name: "Testing", emphasis: "Primary", width: 74, color: "#00bb7f" },
      { name: "CSS", emphasis: "Supporting", width: 39, color: "#ac4bff" },
    ],
    topRepos: [
      {
        name: "cross-platform-ui",
        summary: "Shared component sample used to discuss release safety and platform parity.",
        signal: "Quality sample",
        focus: "Cross-platform confidence and regression discipline.",
      },
      {
        name: "qa-snapshots",
        summary: "Testing fixture repo that anchors conversations about stable review loops.",
        signal: "Testing sample",
        focus: "Golden paths and confidence in change.",
      },
      {
        name: "release-checks",
        summary: "Workflow sample for release criteria, triage, and team handoff rituals.",
        signal: "Release sample",
        focus: "Operational clarity during launches.",
      },
    ],
    activitySummary:
      "The seeded history favors stable release stories, predictable QA rituals, and clean documentation around cross-platform change.",
    readiness: [
      {
        label: "Role fit",
        value: "Good fit",
        sub: "Best when the brief leans toward quality systems or multi-surface delivery.",
      },
      {
        label: "Signal coverage",
        value: "Clear in quality work",
        sub: "The evidence is coherent, but less tuned to pure platform architecture than Nora's profile.",
      },
      {
        label: "Interview priority",
        value: "Strong comparison",
        sub: "Helpful when you want to compare platform leverage against release discipline.",
      },
    ],
    interviewKit: {
      title: "Sample generated interview kit",
      summary: "A seeded kit for quality-heavy panels and cross-platform execution stories.",
      repoSources: [
        { name: "cross-platform-ui", note: "Parity and design consistency sample." },
        { name: "qa-snapshots", note: "Regression and review hygiene sample." },
      ],
      questions: [
        {
          id: 1,
          type: "Quality",
          difficulty: "Core",
          repo: "qa-snapshots",
          prompt:
            "A product team wants to skip a flaky visual test to hit a launch date. What do you ask before agreeing, and what temporary boundary would you set?",
          followUp:
            "Explain how you would keep the compromise visible to the next team that touches the flow.",
          signal:
            "Tests whether the candidate can keep quality tradeoffs concrete instead of abstract.",
        },
        {
          id: 2,
          type: "Delivery",
          difficulty: "Stretch",
          repo: "cross-platform-ui",
          prompt:
            "Design wants parity across platforms, but the native surface has different constraints. How do you keep the shared system trustworthy without forcing false uniformity?",
          followUp:
            "Describe the smallest artifact you would produce so future teams understand the exception.",
          signal:
            "Surfaces judgment around consistency, platform reality, and handoff clarity.",
        },
      ],
    },
  },
  {
    id: "youssef-hassan",
    name: "Youssef Hassan",
    initials: "YH",
    location: "London · Remote",
    githubHandle: "youssefhassan",
    headline: "Demo candidate that is strongest in architecture storytelling and enablement work.",
    stage: "Good stretch candidate when the brief values enablement and migration messaging",
    strengths: ["Micro-frontend tradeoffs", "Migration messaging", "Enablement docs", "Architecture narration"],
    watchouts: ["Needs more direct design-system ownership to top-rank platform roles"],
    focusAreas: ["micro frontend", "architecture", "enablement", "migration", "coaching", "documentation"],
    radarData: [
      { skill: "Code Modularity", value: 86 },
      { skill: "Security Awareness", value: 68 },
      { skill: "Test Coverage", value: 73 },
      { skill: "API Design", value: 84 },
      { skill: "Performance Opt.", value: 71 },
      { skill: "Documentation", value: 89 },
    ],
    signalReadouts: [
      {
        label: "Technical depth",
        value: "Good fit",
        explanation: "The seeded evidence reads strongest when the conversation is about architecture tradeoffs and change management.",
      },
      {
        label: "Execution range",
        value: "Good fit",
        explanation: "The profile stays coherent through migrations, docs, and enablement work.",
      },
      {
        label: "Leadership fit",
        value: "Good fit",
        explanation: "The sample contains facilitator energy, but not as much implementation depth as the featured profile.",
      },
    ],
    profileSignals: [
      {
        label: "Portfolio depth",
        value: "Architecture-led signal",
        detail: "The strongest repos explain system shape and migration paths clearly.",
      },
      {
        label: "Delivery cadence",
        value: "Change-aware",
        detail: "The mock history prioritizes clarity during big moves instead of raw throughput.",
      },
      {
        label: "Platform scope",
        value: "Enablement heavy",
        detail: "Useful when the role blends architecture with internal adoption work.",
      },
      {
        label: "Interview posture",
        value: "Needs depth check",
        detail: "Great for tradeoff conversations, but worth pressure-testing on hands-on ownership.",
      },
    ],
    languages: [
      { name: "TypeScript", emphasis: "Primary", width: 67, color: "#3080ff" },
      { name: "Documentation", emphasis: "Primary", width: 72, color: "#f99c00" },
      { name: "Architecture", emphasis: "Primary", width: 69, color: "#00bb7f" },
      { name: "CSS", emphasis: "Supporting", width: 31, color: "#ac4bff" },
    ],
    topRepos: [
      {
        name: "micro-frontend-shell",
        summary: "Architecture demo sample for routing boundaries, ownership lines, and migration planning.",
        signal: "Architecture sample",
        focus: "Tradeoffs and consumer communication.",
      },
      {
        name: "enablement-guides",
        summary: "Documentation sample used to anchor adoption and rollout conversations.",
        signal: "Enablement sample",
        focus: "Change management and internal storytelling.",
      },
      {
        name: "platform-playbooks",
        summary: "Demo playbook repo focused on decision framing and handoff clarity.",
        signal: "Coordination sample",
        focus: "Shared language for architectural change.",
      },
    ],
    activitySummary:
      "The seeded contribution story emphasizes clear decision records, architecture diagrams, and transition support for downstream teams.",
    readiness: [
      {
        label: "Role fit",
        value: "Needs review",
        sub: "Most compelling when the brief values enablement and migration communication as much as hands-on platform work.",
      },
      {
        label: "Signal coverage",
        value: "Narrative-heavy",
        sub: "The reasoning is easy to explain, but the implementation surface is narrower than the featured candidate.",
      },
      {
        label: "Interview priority",
        value: "Useful stretch",
        sub: "A good panel option when you want explicit tradeoff articulation.",
      },
    ],
    interviewKit: {
      title: "Sample generated interview kit",
      summary: "A seeded kit built around architecture narration, enablement, and migration judgment.",
      repoSources: [
        { name: "micro-frontend-shell", note: "Boundary-setting sample." },
        { name: "enablement-guides", note: "Adoption and documentation sample." },
      ],
      questions: [
        {
          id: 1,
          type: "Architecture",
          difficulty: "Core",
          repo: "micro-frontend-shell",
          prompt:
            "Teams want independence, but support costs are rising. Which boundary would you tighten first, and what evidence would you show before asking everyone to migrate?",
          followUp:
            "Describe how you would keep non-author teams inside the same decision loop.",
          signal:
            "Tests practical architecture judgment rather than broad theory.",
        },
        {
          id: 2,
          type: "Enablement",
          difficulty: "Stretch",
          repo: "enablement-guides",
          prompt:
            "A migration guide is technically correct but nobody follows it. What did the guide miss, and how would you repair trust in the next rollout?",
          followUp:
            "Tell us what artifact you would pair with the guide so teams can act without a live walkthrough.",
          signal:
            "Surfaces the candidate's ability to translate architecture into adoption.",
        },
      ],
    },
  },
];

const demoCandidateIndex = new Map(SEEDED_CANDIDATES.map((candidate) => [candidate.id, candidate]));

function bandPriority(band: FitBand) {
  if (band === "Strong fit") return 0;
  if (band === "Good fit") return 1;
  return 2;
}

function summarizeJobFocus(job: DemoJobDraft) {
  const rawTopics = job.mustHaveTechnologies
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (rawTopics.length === 0) {
    return "the current seeded brief";
  }

  if (rawTopics.length === 1) {
    return rawTopics[0];
  }

  if (rawTopics.length === 2) {
    return `${rawTopics[0]} and ${rawTopics[1]}`;
  }

  return `${rawTopics[0]}, ${rawTopics[1]}, and ${rawTopics[2]}`;
}

function scoreCandidate(job: DemoJobDraft, candidate: DemoCandidateProfile) {
  const haystack = [job.title, job.roleBrief, job.mustHaveTechnologies, job.interviewBrief]
    .join(" ")
    .toLowerCase();

  return candidate.focusAreas.reduce((score, keyword) => {
    return haystack.includes(keyword) ? score + 2 : score;
  }, candidate.id === "nora-salem" ? 1 : 0);
}

function fitBandForRank(index: number): FitBand {
  if (index === 0) return "Strong fit";
  if (index === 1) return "Good fit";
  return "Needs review";
}

function stageForBand(band: FitBand) {
  if (band === "Strong fit") return "Best demo candidate for the next review";
  if (band === "Good fit") return "Useful comparison once the brief is calibrated";
  return "Keep as a stretch comparison if the brief changes";
}

function buildMatchSummary(job: DemoJobDraft, candidate: DemoCandidateProfile, band: FitBand): DemoMatchSummary {
  const jobFocus = summarizeJobFocus(job);

  return {
    id: candidate.id,
    name: candidate.name,
    initials: candidate.initials,
    location: candidate.location,
    fitBand: band,
    stage: stageForBand(band),
    topRepo: candidate.topRepos[0]?.name || "Seeded repo sample",
    matchSummary:
      `${candidate.name}'s seeded profile leans into ${candidate.strengths.slice(0, 2).join(" and ")}, ` +
      `which keeps the story aligned with ${job.title} and the brief's focus on ${jobFocus}.`,
    strengths: candidate.strengths,
    watchouts: candidate.watchouts,
    radarData: candidate.radarData,
    signalReadouts: candidate.signalReadouts.map((signal) => ({
      ...signal,
      value: bandPriority(band) < 2 && signal.value === "Needs review" ? "Good fit" : signal.value,
    })),
  };
}

export function getDemoCandidateById(candidateId: string) {
  return demoCandidateIndex.get(candidateId) ?? SEEDED_CANDIDATES[0];
}

export function getDefaultDemoSession() {
  return buildDemoSessionForJob(DEFAULT_DEMO_JOB);
}

export function buildDemoSessionForJob(jobInput: DemoJobDraft | Partial<Omit<DemoJobDraft, "slug">> & { slug?: string }) {
  const job = "slug" in jobInput && typeof jobInput.slug === "string" && jobInput.title
    ? createDemoJobDraft(jobInput)
    : createDemoJobDraft(jobInput);

  const rankedCandidates = [...SEEDED_CANDIDATES]
    .map((candidate) => ({ candidate, score: scoreCandidate(job, candidate) }))
    .sort((left, right) => right.score - left.score || left.candidate.name.localeCompare(right.candidate.name))
    .map(({ candidate }, index) => buildMatchSummary(job, candidate, fitBandForRank(index)));

  return {
    job,
    featuredCandidateId: rankedCandidates[0]?.id || SEEDED_CANDIDATES[0].id,
    matches: rankedCandidates,
    updatedAt: "Seeded demo session",
  } satisfies ActiveDemoSession;
}
