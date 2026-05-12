import {
  type ActiveDemoSession,
  buildDemoSessionForJob,
  createDemoJobDraft,
  DEFAULT_DEMO_JOB,
  getDefaultDemoSession,
  slugifyJobTitle,
} from "@/lib/demo-data";

type DemoSessionStore = {
  activeSlug: string;
  sessions: Record<string, ActiveDemoSession>;
};

const STORAGE_KEY = "devscreen.demo-session.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function buildFallbackStore(): DemoSessionStore {
  const session = getDefaultDemoSession();

  return {
    activeSlug: session.job.slug,
    sessions: {
      [session.job.slug]: session,
    },
  };
}

function sanitizeStore(store: DemoSessionStore | null | undefined) {
  const fallback = buildFallbackStore();

  if (!store) {
    return fallback;
  }

  const sessions = Object.fromEntries(
    Object.entries(store.sessions || {}).map(([slug, session]) => {
      const nextJob = createDemoJobDraft({ ...DEFAULT_DEMO_JOB, ...session.job, slug });
      return [slug, buildDemoSessionForJob(nextJob)];
    })
  );

  const activeSlug = store.activeSlug && sessions[store.activeSlug] ? store.activeSlug : fallback.activeSlug;

  return {
    activeSlug,
    sessions: Object.keys(sessions).length > 0 ? sessions : fallback.sessions,
  } satisfies DemoSessionStore;
}

export function readDemoSessionStore() {
  if (!isBrowser()) {
    return buildFallbackStore();
  }

  const rawStore = window.localStorage.getItem(STORAGE_KEY);

  if (!rawStore) {
    const fallback = buildFallbackStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawStore) as DemoSessionStore;
    const sanitized = sanitizeStore(parsed);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    const fallback = buildFallbackStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function writeDemoSessionStore(store: DemoSessionStore) {
  const sanitized = sanitizeStore(store);

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  }

  return sanitized;
}

export function getDemoSession(slug?: string) {
  const store = readDemoSessionStore();
  const requestedSlug = slug || store.activeSlug;

  if (store.sessions[requestedSlug]) {
    if (requestedSlug !== store.activeSlug) {
      writeDemoSessionStore({
        ...store,
        activeSlug: requestedSlug,
      });
    }

    return store.sessions[requestedSlug];
  }

  const fallbackJob = createDemoJobDraft({ ...DEFAULT_DEMO_JOB, slug: requestedSlug, title: DEFAULT_DEMO_JOB.title });
  const fallbackSession = buildDemoSessionForJob(fallbackJob);
  const nextStore = writeDemoSessionStore({
    activeSlug: fallbackSession.job.slug,
    sessions: {
      ...store.sessions,
      [fallbackSession.job.slug]: fallbackSession,
    },
  });

  return nextStore.sessions[fallbackSession.job.slug];
}

export function saveDemoSession(input: Partial<Omit<ActiveDemoSession["job"], "slug">> & { slug?: string }) {
  const job = createDemoJobDraft(input);
  const session = buildDemoSessionForJob(job);
  const store = readDemoSessionStore();

  writeDemoSessionStore({
    activeSlug: session.job.slug,
    sessions: {
      ...store.sessions,
      [session.job.slug]: session,
    },
  });

  return session;
}

export function setActiveDemoSession(slug: string) {
  return getDemoSession(slug);
}

export function getActiveMatchesHref() {
  const session = getDemoSession();
  return `/recruiter/jobs/${session.job.slug}/matches`;
}

export function getCandidateHref() {
  return "/candidate";
}

export function slugFromTitle(title: string) {
  return slugifyJobTitle(title);
}
