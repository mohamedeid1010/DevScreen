import { NextResponse } from 'next/server';
import { fetchFullGitHubProfile } from '@/services/github.service';
import { RagService } from '@/services/rag.service';
import { generateCandidateInsights } from '@/services/ai.service';
import { saveAnalysisForUser } from '@/services/analyses.service';

const ANALYZE_TIMEOUT_MS = 5 * 60 * 1000;
const ANALYZE_TIMEOUT_MESSAGE = 'Analysis timed out after 5 minutes';
const NO_ANALYZABLE_CODE_MESSAGE = 'This GitHub user has no analyzable public code.';
const NO_ANALYZABLE_CODE_FRIENDLY_MESSAGE = 'This GitHub user has no analyzable public code. Try a user with public source repositories.';

function validateJobDescription(jobDescription: unknown) {
  if (typeof jobDescription !== 'string') {
    return 'jobDescription must be a string';
  }
  if (jobDescription.length < 20 || jobDescription.length > 10000) {
    return 'jobDescription must be between 20 and 10,000 characters';
  }
  return null;
}

function extractGitHubUsername(input: string): string {
  let cleaned = input.trim();
  if (cleaned.startsWith('http')) {
    try {
      const url = new URL(cleaned);
      cleaned = url.pathname.replace(/^\/+/, '').split('/')[0];
    } catch {
      // not a URL, use as-is
    }
  }
  return cleaned;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
  }

  const rawUsername = (payload as { githubUsername?: unknown })?.githubUsername;
  if (typeof rawUsername !== 'string' || rawUsername.trim().length === 0) {
    return NextResponse.json(
      { error: 'githubUsername is required. Provide a GitHub username or profile URL.' },
      { status: 400 },
    );
  }

  const githubUsername = extractGitHubUsername(rawUsername);

  const jobDescription = (payload as { jobDescription?: unknown })?.jobDescription;
  const validationError = validateJobDescription(jobDescription);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const finalJobDescription = jobDescription as string;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      let isStreamActive = true;

      const send = (event: any) => {
        if (!isStreamActive) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        await Promise.race([
          (async () => {
            // Stage 1: Fetch GitHub profile and repositories
            send({ stage: 'github', message: `Fetching GitHub profile for @${githubUsername}...` });
            const githubData = await fetchFullGitHubProfile(githubUsername, false);
            send({ stage: 'github_done', message: `Fetched profile and ${Object.keys(githubData.codeByRepo).length} repositories.` });

            // Stage 2: AST analysis + embedding generation + similarity calculation
            const ragService = new RagService();
            send({ stage: 'embeddings', message: 'Chunking code, computing AST complexity, generating embeddings, and calculating similarity...' });
            const topCodeChunks = await ragService.evaluateCandidateCode(finalJobDescription, githubData.codeByRepo, githubUsername);
            send({ stage: 'embeddings_done', message: `Analyzed ${topCodeChunks.length} top code chunks by similarity.` });

            // Stage 3: AI reasoning
            send({ stage: 'insights', message: 'Running AI analysis with Gemini (fit assessment, strengths, interview questions)...' });
            const insights = await generateCandidateInsights(
              githubData.profile,
              topCodeChunks,
              finalJobDescription,
            );

            const avgComplexity = topCodeChunks.length > 0
              ? Math.round(topCodeChunks.reduce((acc: number, chunk: any) => acc + chunk.complexity, 0) / topCodeChunks.length)
              : 1;

            const result = {
              ...insights,
              topCodeChunks,
              githubProfile: githubData.profile,
              astComplexityScore: avgComplexity,
            };

            // Persist to Supabase
            try {
              await saveAnalysisForUser({
                userId: '00000000-0000-0000-0000-000000000000',
                githubUsername,
                result,
                jobDescription: finalJobDescription,
              });
            } catch (saveError) {
              console.error('Failed to persist analysis:', saveError);
            }

            send({ stage: 'done', result });
          })(),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
              reject(new Error(ANALYZE_TIMEOUT_MESSAGE));
            }, ANALYZE_TIMEOUT_MS);
          }),
        ]);
      } catch (error: unknown) {
        console.error('API Error:', error);

        const message = error instanceof Error ? error.message : 'Unknown server error';
        const friendlyMessage = message === NO_ANALYZABLE_CODE_MESSAGE
          ? NO_ANALYZABLE_CODE_FRIENDLY_MESSAGE
          : message;

        send({ stage: 'error', message: friendlyMessage });
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        isStreamActive = false;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-store',
    },
  });
}
