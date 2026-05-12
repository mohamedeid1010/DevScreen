"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type ActiveDemoSession,
  getDemoCandidateById,
  getDefaultDemoSession,
} from "@/lib/demo-data";
import {
  getDemoSession,
  saveDemoSession,
  setActiveDemoSession,
} from "@/lib/demo-session";

type DemoSessionContextValue = {
  isReady: boolean;
  session: ActiveDemoSession;
  featuredCandidate: ReturnType<typeof getDemoCandidateById>;
  featuredMatch: ActiveDemoSession["matches"][number];
  candidateHref: string;
  matchesHref: string;
  saveJobDraft: (input: Parameters<typeof saveDemoSession>[0]) => ActiveDemoSession;
  syncToSlug: (slug: string) => ActiveDemoSession;
  refresh: (slug?: string) => ActiveDemoSession;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

type DemoSessionProviderProps = Readonly<{
  children: ReactNode;
}>;

function readSession(slug?: string) {
  return getDemoSession(slug);
}

export function DemoSessionProvider({ children }: DemoSessionProviderProps) {
  const [session, setSession] = useState<ActiveDemoSession>(getDefaultDemoSession());
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback((slug?: string) => {
    const nextSession = readSession(slug);
    startTransition(() => {
      setSession(nextSession);
    });
    return nextSession;
  }, []);

  const syncToSlug = useCallback((slug: string) => {
    const nextSession = setActiveDemoSession(slug);
    startTransition(() => {
      setSession(nextSession);
    });
    return nextSession;
  }, []);

  const saveJobDraft = useCallback((input: Parameters<typeof saveDemoSession>[0]) => {
    const nextSession = saveDemoSession(input);
    startTransition(() => {
      setSession(nextSession);
    });
    return nextSession;
  }, []);

  useEffect(() => {
    startTransition(() => {
      setSession(readSession());
      setIsReady(true);
    });

    const handleStorage = () => {
      startTransition(() => {
        setSession(readSession());
      });
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const featuredMatch =
    session.matches.find((match) => match.id === session.featuredCandidateId) ?? session.matches[0];
  const featuredCandidate = getDemoCandidateById(featuredMatch?.id || session.featuredCandidateId);

  return (
    <DemoSessionContext.Provider
      value={{
        isReady,
        session,
        featuredCandidate,
        featuredMatch,
        candidateHref: "/candidate",
        matchesHref: `/recruiter/jobs/${session.job.slug}/matches`,
        saveJobDraft,
        syncToSlug,
        refresh,
      }}
    >
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);

  if (!context) {
    throw new Error("useDemoSession must be used within a DemoSessionProvider.");
  }

  return context;
}