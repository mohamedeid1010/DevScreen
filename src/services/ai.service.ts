import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const GEMINI_TIMEOUT_MS = 30_000;
const GEMINI_TIMEOUT_MESSAGE = 'Gemini request timed out after 30 seconds';
const FALLBACK_ANALYSIS = {
  fitBand: 'Needs review',
  matchSummary: 'AI analysis returned an unexpected format. Try re-running the analysis.',
  strengths: [],
  watchouts: ['Analysis result could not be parsed'],
  interviewQuestions: [],
};

async function generateContentWithTimeout(model: any, prompt: string) {
  if (typeof AbortController !== 'undefined') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      return await model.generateContent(prompt, { signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error(GEMINI_TIMEOUT_MESSAGE);
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return Promise.race([
    model.generateContent(prompt),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(GEMINI_TIMEOUT_MESSAGE)), GEMINI_TIMEOUT_MS);
    }),
  ]);
}

export const generateCandidateInsights = async (
    userData: any, 
    topCodeChunks: any[], 
    jobDescription: string
) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an expert technical recruiter and senior software engineer.
      I am providing you with the comprehensive GitHub data of a job candidate, their best-matching code snippets, and the Job Description.
      
      Your job is to analyze this data and return a JSON object containing insights to populate the recruiter dashboard.
      
      Job Description:
      ${jobDescription}

      Candidate Profile & Repositories Metadata:
      ${JSON.stringify(userData)}

      Best Matching Code Snippets (Based on Cosine Similarity):
      ${JSON.stringify(topCodeChunks)}

      Return ONLY a valid JSON object matching exactly this structure (no markdown fences, just the raw JSON):
      {
        "fitBand": "Strong fit" | "Good fit" | "Poor fit",
        "matchSummary": "A 2-3 sentence summary of why they are a fit (or not) for this specific role based on their code.",
        "strengths": ["string", "string", "string"],
        "watchouts": ["string", "string", "string"],
        "interviewQuestions": [
           "A highly specific technical question asking about the logic in their provided code snippet.",
           "Another specific question..."
        ]
      }
    `;
    const result = await generateContentWithTimeout(model, prompt);
    const responseText = result.response.text();
    
    // clean markdown fences if gemini returns them
    const cleaned = responseText.replace(/```json\n|\n```|```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const rawResponsePreview = responseText.length > 500
        ? `${responseText.slice(0, 500)}...`
        : responseText;

      console.error('Failed to parse Gemini JSON response:', rawResponsePreview);
      return FALLBACK_ANALYSIS;
    }
  } catch (error: any) {
    console.error('Error analyzing data with Gemini:', error.message);
    throw new Error(`Failed to analyze data with Gemini: ${error.message}`);
  }
};
