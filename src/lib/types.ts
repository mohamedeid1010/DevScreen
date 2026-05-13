import { type FitBand } from "@/lib/demo-data";

export type AnalysisTopCodeChunk = {
  content?: string;
  file?: string;
  repo?: string;
  complexity?: number;
  similarity?: number;
};

export type AnalysisGitHubProfile = {
  login?: string;
  name?: string;
  location?: string;
};

export type AnalysisResult = {
  fitBand: FitBand | "Poor fit";
  matchSummary: string;
  strengths: string[];
  watchouts: string[];
  interviewQuestions: string[];
  topCodeChunks: AnalysisTopCodeChunk[];
  githubProfile: AnalysisGitHubProfile;
  astComplexityScore: number;
};