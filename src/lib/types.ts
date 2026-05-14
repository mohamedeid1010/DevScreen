export type FitBand = "Strong fit" | "Good fit" | "Needs review";

export type SkillBreakdown = {
  frontend: number;
  backend: number;
  testing: number;
  devops: number;
  architecture: number;
  documentation: number;
};

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
  avatarUrl?: string;
  public_repos?: number;
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
  skillBreakdown?: SkillBreakdown;
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  seniority: string | null;
  hiring_manager: string | null;
  role_brief: string;
  must_have_tech: string | null;
  interview_brief: string | null;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  job_id: string | null;
  github_username: string;
  full_name: string | null;
  email: string | null;
  cv_url: string | null;
  cover_letter: string | null;
  similarity_score: number | null;
  skill_breakdown: SkillBreakdown | null;
  analysis_id: string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  applied_at: string;
  // joined fields
  job?: Job;
};