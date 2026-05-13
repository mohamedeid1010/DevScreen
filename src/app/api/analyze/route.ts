import { NextResponse } from 'next/server';
import { fetchFullGitHubProfile } from '@/services/github.service';
import { RagService } from '@/services/rag.service';
import { generateCandidateInsights } from '@/services/ai.service';

export async function POST(request: Request) {
  try {
    const { githubUsername, jobDescription } = await request.json();

    if (!githubUsername || !jobDescription) {
      return NextResponse.json({ error: 'Missing githubUsername or jobDescription' }, { status: 400 });
    }

    console.log(`Starting analysis for ${githubUsername}...`);

    // 1. Fetch GitHub Data
    const githubData = await fetchFullGitHubProfile(githubUsername);
    
    // 2. Run RAG (CodeBERT Embeddings + Cosine Similarity + AST Complexity)
    const ragService = new RagService();
    const topCodeChunks = await ragService.evaluateCandidateCode(jobDescription, githubData.codeByRepo);

    // 3. Generate Gemini Insights
    const insights = await generateCandidateInsights(
        githubData.profile, 
        topCodeChunks, 
        jobDescription
    );

    // Calculate an average complexity from the top chunks
    const avgComplexity = topCodeChunks.length > 0 
      ? Math.round(topCodeChunks.reduce((acc: number, chunk: any) => acc + chunk.complexity, 0) / topCodeChunks.length) 
      : 1;

    return NextResponse.json({
        ...insights,
        topCodeChunks,
        githubProfile: githubData.profile,
        astComplexityScore: avgComplexity
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
