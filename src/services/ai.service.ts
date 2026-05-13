import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    console.log('Sending candidate data to Gemini for JSON insights...');
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // clean markdown fences if gemini returns them
    const cleaned = responseText.replace(/```json\n|\n```|```/g, '').trim();
    
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Error analyzing data with Gemini:', error.message);
    throw new Error(`Failed to analyze data with Gemini: ${error.message}`);
  }
};
