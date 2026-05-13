import { NextResponse } from "next/server";
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchLanguageStats,
  fetchCommitActivity,
} from "@/lib/github.service";

/**
 * GET /api/github/[username]
 *
 * Fetch raw GitHub profile data for a user without running AI analysis.
 * Useful for previewing what data will be sent to the analysis pipeline.
 */
export async function GET(_request, { params }) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    const [profile, repos, languages, commitActivity] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepos(username),
      fetchLanguageStats(username),
      fetchCommitActivity(username),
    ]);

    return NextResponse.json({
      success: true,
      profile,
      repos,
      languages,
      commitActivity,
    });
  } catch (error) {
    console.error("GitHub fetch error:", error);

    const status = error.status || 500;
    const message =
      error.message?.includes("Not Found")
        ? "GitHub user not found"
        : error.message || "Internal server error";

    return NextResponse.json({ error: message }, { status });
  }
}
