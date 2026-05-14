"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Job } from "@/lib/types";

const STORAGE_KEY = "devscreen.last-analysis";

const SENIORITY_COLORS: Record<string, string> = {
  Senior: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Mid-Senior": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Mid: "bg-green-500/15 text-green-400 border-green-500/30",
  Intern: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [githubUsername, setGithubUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Match preview
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setJob(data);
        }
      })
      .catch(() => setError("Failed to load job"))
      .finally(() => setLoading(false));

    // Check localStorage for saved analysis
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username) {
          setGithubUsername(parsed.username);
          setHasAnalysis(true);
        }
      }
    } catch {}
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          github_username: githubUsername.trim(),
          full_name: fullName.trim() || null,
          email: email.trim() || null,
          cover_letter: coverLetter.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit application");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-[#a8a29e] text-center py-12">Loading job...</div>;
  }

  if (error && !job) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-12 text-center text-red-300">
        {error}
      </div>
    );
  }

  if (!job) return null;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
        <div className="text-5xl">🎉</div>
        <h1 className="text-3xl font-bold text-[#f2eae3]">Application Submitted!</h1>
        <p className="text-[#a8a29e] text-lg">
          Your application for <strong className="text-[#f2eae3]">{job.title}</strong> has been
          submitted. The system has calculated your match score automatically.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={() => router.push("/candidate/jobs")}
            className="px-6 py-2.5 rounded-xl bg-[#e4002b] text-white font-semibold hover:bg-[#c80025] transition"
          >
            Browse More Jobs
          </button>
          <button
            onClick={() => router.push("/candidate")}
            className="px-6 py-2.5 rounded-xl border border-[#ffffff18] bg-[#111113] text-[#f2eae3] font-semibold hover:border-[#e4002b]/30 transition"
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Job Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {job.seniority && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                SENIORITY_COLORS[job.seniority] || SENIORITY_COLORS["Mid"]
              }`}
            >
              {job.seniority}
            </span>
          )}
          {job.location && <span className="text-sm text-[#6b6670]">{job.location}</span>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
        {job.hiring_manager && (
          <p className="text-[#a8a29e] mt-1">Hiring Manager: {job.hiring_manager}</p>
        )}
      </div>

      {/* Role Brief */}
      <div className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#f2eae3]">About the Role</h2>
        <p className="text-sm text-[#d8d0ca] leading-relaxed whitespace-pre-wrap">
          {job.role_brief}
        </p>
      </div>

      {/* Requirements */}
      {job.must_have_tech && (
        <div className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#f2eae3]">Required Skills & Tech</h2>
          <div className="flex flex-wrap gap-2">
            {job.must_have_tech.split(",").map((tech) => (
              <span
                key={tech.trim()}
                className="px-3 py-1 rounded-lg bg-[#e4002b]/10 text-[#e4002b] text-sm font-medium border border-[#e4002b]/20"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Match Indicator */}
      {hasAnalysis && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
          <p className="text-sm text-[#d8d0ca]">
            <strong className="text-green-400">✓ Analysis detected:</strong> Your GitHub profile
            ({githubUsername}) has been analyzed. When you apply, your match score will be
            calculated automatically against this job&apos;s requirements.
          </p>
        </div>
      )}

      {/* Application Form */}
      <div className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[#f2eae3]">Apply Now</h2>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#a8a29e]">
                GitHub Username <span className="text-[#e4002b]">*</span>
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. torvalds"
                required
                className="w-full h-11 rounded-lg border border-[#ffffff18] bg-[#09090b] px-4 text-[#f2eae3] placeholder:text-[#6b6670] focus:border-[#e4002b] focus:outline-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#a8a29e]">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 rounded-lg border border-[#ffffff18] bg-[#09090b] px-4 text-[#f2eae3] placeholder:text-[#6b6670] focus:border-[#e4002b] focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#a8a29e]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 rounded-lg border border-[#ffffff18] bg-[#09090b] px-4 text-[#f2eae3] placeholder:text-[#6b6670] focus:border-[#e4002b] focus:outline-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#a8a29e]">
              Cover Letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Tell us why you're interested in this role..."
              className="w-full rounded-lg border border-[#ffffff18] bg-[#09090b] px-4 py-3 text-sm text-[#f2eae3] placeholder:text-[#6b6670] focus:border-[#e4002b] focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !githubUsername.trim()}
            className="w-full h-12 rounded-xl bg-[#e4002b] text-white font-semibold text-base hover:bg-[#c80025] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
