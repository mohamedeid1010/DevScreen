import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchFullGitHubProfile } from '@/services/github.service';
import { RagService } from '@/services/rag.service';
import { generateCandidateInsights } from '@/services/ai.service';
import { saveAnalysisForUser } from '@/services/analyses.service';
import { getAuthUserGitHubLogin } from '@/lib/auth-user';
import { createClient } from '@/utils/supabase/server';

const ANALYZE_TIMEOUT_MS = 5 * 60 * 1000;
const ANALYZE_TIMEOUT_MESSAGE = 'Analysis timed out after 5 minutes';
const NO_ANALYZABLE_CODE_MESSAGE = 'This GitHub user has no analyzable public code.';
const NO_ANALYZABLE_CODE_FRIENDLY_MESSAGE = 'This GitHub user has no analyzable public code. Try a user with public source repositories.';
const GITHUB_OAUTH_COOKIE = 'github_provider_token';

function validateJobDescription(jobDescription: unknown) {
  if (typeof jobDescription !== 'string') {
    return 'jobDescription must be a string';
  }
  if (jobDescription.length < 20 || jobDescription.length > 10000) {
    return 'jobDescription must be between 20 and 10000 characters';
  }
  return null;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const githubProviderToken = sessionData.session?.provider_token ?? cookieStore.get(GITHUB_OAUTH_COOKIE)?.value ?? null;
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const githubUsername = getAuthUserGitHubLogin(userData.user);

  if (!githubUsername) {
    return NextResponse.json(
      { error: 'No GitHub username found on your Supabase account. Sign in with GitHub.' },
      { status: 400 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
  }

  const jobDescription = (payload as { jobDescription?: unknown })?.jobDescription;
  const validationError = validateJobDescription(jobDescription);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const userId = userData.user.id;
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
            send({ stage: 'github' });
            const githubData = await fetchFullGitHubProfile(githubUsername, false, {
              authToken: githubProviderToken,
            });

            const ragService = new RagService();
            send({ stage: 'embeddings' });
            const topCodeChunks = await ragService.evaluateCandidateCode(finalJobDescription, githubData.codeByRepo);

            send({ stage: 'insights' });
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

            try {
              await saveAnalysisForUser({
                userId,
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
