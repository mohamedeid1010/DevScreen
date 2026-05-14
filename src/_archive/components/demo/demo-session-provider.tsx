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
import { type AnalysisResult } from "@/lib/types";

type DemoSessionContextValue = {
  isReady: boolean;
  session: ActiveDemoSession;
  featuredCandidate: ReturnType<typeof getDemoCandidateById>;
  featuredMatch: ActiveDemoSession["matches"][number];
  liveAnalysis: AnalysisResult | null;
  candidateHref: string;
  matchesHref: string;
  saveJobDraft: (input: Parameters<typeof saveDemoSession>[0]) => ActiveDemoSession;
  setLiveAnalysis: (result: AnalysisResult | null) => void;
  syncToSlug: (slug: string) => ActiveDemoSession;
  refresh: (slug?: string) => ActiveDemoSession;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

type DemoSessionProviderProps = Readonly<{
  children: ReactNode;
}>;

const LIVE_ANALYSIS_STORAGE_KEY = "devscreen.live-analysis.v1";

function readSession(slug?: string) {
  return getDemoSession(slug);
}

function readLiveAnalysis() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawAnalysis = window.localStorage.getItem(LIVE_ANALYSIS_STORAGE_KEY);

  if (!rawAnalysis) {
    return null;
  }

  try {
    return JSON.parse(rawAnalysis) as AnalysisResult;
  } catch {
    window.localStorage.removeItem(LIVE_ANALYSIS_STORAGE_KEY);
    return null;
  }
}

function writeLiveAnalysis(result: AnalysisResult | null) {
  if (typeof window === "undefined") {
    return result;
  }

  if (!result) {
    window.localStorage.removeItem(LIVE_ANALYSIS_STORAGE_KEY);
    return null;
  }

  window.localStorage.setItem(LIVE_ANALYSIS_STORAGE_KEY, JSON.stringify(result));
  return result;
}

export function DemoSessionProvider({ children }: DemoSessionProviderProps) {
  const [session, setSession] = useState<ActiveDemoSession>(getDefaultDemoSession());
  const [isReady, setIsReady] = useState(false);
  const [liveAnalysis, setLiveAnalysisState] = useState<AnalysisResult | null>(null);

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

  const setLiveAnalysis = useCallback((result: AnalysisResult | null) => {
    const nextLiveAnalysis = writeLiveAnalysis(result);
    startTransition(() => {
      setLiveAnalysisState(nextLiveAnalysis);
    });
  }, []);

  useEffect(() => {
    startTransition(() => {
      setSession(readSession());
      setLiveAnalysisState(readLiveAnalysis());
      setIsReady(true);
    });

    const handleStorage = (event: StorageEvent) => {
      startTransition(() => {
        if (!event.key || event.key === "devscreen.demo-session.v1") {
          setSession(readSession());
        }

        if (!event.key || event.key === LIVE_ANALYSIS_STORAGE_KEY) {
          setLiveAnalysisState(readLiveAnalysis());
        }
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
        liveAnalysis,
        candidateHref: "/candidate",
        matchesHref: `/recruiter/jobs/${session.job.slug}/matches`,
        saveJobDraft,
        setLiveAnalysis,
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