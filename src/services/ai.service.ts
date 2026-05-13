import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeCandidateData = async (userData: any, repoCode?: Record<string, string>) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an expert technical recruiter and senior software engineer.
      I am providing you with the comprehensive GitHub data of a job candidate.
      
      Please analyze this candidate's profile, repository statistics, commit history, and source code (if provided) to provide a detailed evaluation of their skills.
      
      Focus on:
      1. Overall Experience & Activity (based on profile and commit history)
      2. Language & Technology Stack (based on repository language stats)
      3. Code Quality & Architecture (based on the source code provided)
      4. Strengths & Weaknesses
      5. Overall Rating (Out of 10)

      Format your response in clean Markdown.

      ### Candidate Profile & Repositories Metadata:
      ${JSON.stringify(userData)}

      ### Candidate Source Code:
      ${repoCode ? JSON.stringify(repoCode) : "No source code provided for this analysis."}
    `;

    console.log('Sending candidate data to Gemini 2.5 Flash for analysis...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error: any) {
    console.error('Error analyzing data with Gemini:', error.message);
    throw new Error(`Failed to analyze data with Gemini: ${error.message}`);
  }
};
