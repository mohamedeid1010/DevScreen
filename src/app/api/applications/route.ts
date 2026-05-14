import { NextResponse } from "next/server";
import { getOptionalSupabase } from "@/services/supabase.service";
import { generateEmbedding } from "@/services/embedding.service";
import cosineSimilarity from "compute-cosine-similarity";

export async function GET(request: Request) {
  const supabase = getOptionalSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("job_id");
  const minSimilarity = parseFloat(searchParams.get("min_similarity") || "0");

  let query = (supabase.from("applications") as any)
    .select("*, job:jobs(*)")
    .order("applied_at", { ascending: false });

  if (jobId) {
    query = query.eq("job_id", jobId);
  }

  if (minSimilarity > 0) {
    query = query.gte("similarity_score", minSimilarity);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = getOptionalSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { job_id, github_username, full_name, email, cover_letter } = body;

  if (!job_id || !github_username) {
    return NextResponse.json(
      { error: "job_id and github_username are required" },
      { status: 400 }
    );
  }

  // Get the job requirements for similarity calculation
  const { data: job, error: jobError } = await (supabase.from("jobs") as any)
    .select("role_brief, must_have_tech")
    .eq("id", job_id)
    .maybeSingle();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const jobRequirementsText = [job.role_brief, job.must_have_tech].filter(Boolean).join(" ");

  // Get the candidate's latest analysis
  const { data: analysis } = await (supabase.from("analyses") as any)
    .select("id, result, skill_breakdown")
    .eq("github_username", github_username)
    .order("analyzed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Calculate similarity score between job requirements and candidate's code embeddings
  let similarityScore = 0;
  let skillBreakdown = null;

  if (analysis?.result) {
    try {
      // Generate embedding for job requirements
      const jobVec = await generateEmbedding(jobRequirementsText);

      // Get candidate's code embeddings
      const { data: embeddings } = await (supabase.from("code_embeddings") as any)
        .select("embedding")
        .eq("github_username", github_username)
        .limit(40);

      if (embeddings && embeddings.length > 0) {
        // Parse embeddings — they may be stored as JSON strings in the DB
        const parsed = embeddings
          .map((e: any) => {
            if (!e.embedding) return null;
            if (Array.isArray(e.embedding)) return e.embedding;
            if (typeof e.embedding === "string") {
              try { return JSON.parse(e.embedding); } catch { return null; }
            }
            return null;
          })
          .filter((v: any) => Array.isArray(v) && v.length > 0);

        // Calculate average similarity across all code chunks
        const similarities = parsed
          .map((vec: number[]) => cosineSimilarity(jobVec, vec) || 0);

        if (similarities.length > 0) {
          // Use top 5 most similar chunks for the score
          const topSimilarities = similarities
            .sort((a: number, b: number) => b - a)
            .slice(0, 5);
          const avg =
            topSimilarities.reduce((a: number, b: number) => a + b, 0) /
            topSimilarities.length;
          similarityScore = Math.round(avg * 10000) / 100; // Convert to percentage
        }
      }

      // Use skill breakdown from analysis if available
      skillBreakdown = analysis.result?.skillBreakdown || analysis.skill_breakdown || null;
    } catch (err) {
      console.warn("Failed to calculate similarity:", err);
    }
  }

  // Save the application
  const row = {
    job_id,
    github_username,
    full_name: full_name || null,
    email: email || null,
    cover_letter: cover_letter || null,
    similarity_score: similarityScore,
    skill_breakdown: skillBreakdown,
    analysis_id: analysis?.id || null,
    status: "pending",
    applied_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertError } = await (supabase.from("applications") as any)
    .insert([row])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 201 });
}
