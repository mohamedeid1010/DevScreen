import { GoogleGenAI } from "@google/genai";

/**
 * AI Service — uses Gemini 2.5 Flash to perform technical recruitment analysis.
 * Takes GitHub profile data, AST analysis, and RAG context to produce
 * structured evaluation reports.
 */

const MODEL_ID = "gemini-2.5-flash";

let _client = null;

function getClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set");
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

/**
 * Build the system prompt for candidate analysis.
 */
function buildSystemPrompt() {
  return `You are DevScreen AI, an expert technical recruiter analyst.
You analyze GitHub profiles, source code, and commit history to produce structured,
evidence-based candidate evaluations for technical hiring.

Your analysis must be:
- Grounded in actual code evidence and commit patterns
- Fair and objective — focus on demonstrated skills, not assumptions
- Actionable — give recruiters clear signals they can act on
- Structured — always return valid JSON matching the requested schema

Important: Base your analysis only on the provided data. If evidence is limited,
say so honestly rather than speculating.`;
}

/**
 * Run the full candidate analysis pipeline.
 */
export async function analyzeCandidateProfile({
  profile,
  repos,
  languages,
  commitActivity,
  astAnalysis,
  ragContext,
}) {
  const client = getClient();

  const prompt = `Analyze this GitHub developer profile for technical recruitment.

## Developer Profile
- **Username:** ${profile.login}
- **Name:** ${profile.name || "N/A"}
- **Bio:** ${profile.bio || "N/A"}
- **Company:** ${profile.company || "N/A"}
- **Location:** ${profile.location || "N/A"}
- **Public Repos:** ${profile.publicRepos}
- **Followers:** ${profile.followers}
- **Account Age:** Created ${profile.createdAt}

## Top Repositories
${repos.slice(0, 6).map((r) => `- **${r.name}**: ${r.description || "No description"} | ⭐ ${r.stars} | Language: ${r.language} | Topics: ${r.topics.join(", ") || "none"}`).join("\n")}

## Language Distribution
${languages.slice(0, 8).map((l) => `- ${l.language}: ${l.percentage}%`).join("\n")}

## Recent Commit Activity (last 90 days)
Total commits sampled: ${commitActivity.length}
${commitActivity.slice(0, 15).map((c) => `- [${c.repo}] ${c.message} (${c.date})`).join("\n")}

## Code Structure Analysis (AST)
${formatASTSummary(astAnalysis)}

## Code Evidence (RAG-retrieved)
${ragContext || "No deep code analysis available."}

---

Return your analysis as JSON with this exact structure:
{
  "summary": "2-3 sentence executive summary",
  "overallScore": 0-100,
  "skills": [
    { "label": "skill name", "value": 0-100 }
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "growthAreas": ["area 1", "area 2"],
  "highlights": ["career highlight 1", "career highlight 2", "career highlight 3"],
  "readiness": {
    "roleFit": "percentage string like 85%",
    "signalBreadth": "fraction like 5/6",
    "interviewUrgency": "Low | Medium | High"
  },
  "recommendation": "1-2 sentence recommendation for the recruiter",
  "interviewFocus": ["topic 1", "topic 2", "topic 3"],
  "signals": {
    "technicalDepth": 0-100,
    "executionRange": 0-100,
    "leadershipFit": 0-100,
    "portfolioDepth": 0-100,
    "systemDesign": 0-100,
    "interviewReadiness": 0-100
  }
}`;

  const response = await client.models.generateContent({
    model: MODEL_ID,
    contents: prompt,
    config: {
      systemInstruction: buildSystemPrompt(),
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = response.text;

  try {
    return JSON.parse(text);
  } catch {
    // If JSON parsing fails, try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("AI response was not valid JSON");
  }
}

/**
 * Generate interview questions tailored to a candidate's profile.
 */
export async function generateInterviewQuestions({
  profile,
  analysisResult,
  jobDescription,
  questionCount = 5,
}) {
  const client = getClient();

  const prompt = `Generate ${questionCount} interview questions for this candidate.

## Candidate
- **Name:** ${profile.name || profile.login}
- **Overall Score:** ${analysisResult.overallScore}/100
- **Strengths:** ${analysisResult.strengths.join(", ")}
- **Growth Areas:** ${analysisResult.growthAreas.join(", ")}
- **Interview Focus:** ${analysisResult.interviewFocus.join(", ")}

## Job Description
${jobDescription || "General senior frontend engineering role"}

Return JSON:
{
  "questions": [
    {
      "type": "Architecture | Performance | Leadership | AI Workflow | System Design",
      "difficulty": "Medium | High | Advanced",
      "question": "the interview question",
      "signal": "what this question reveals about the candidate"
    }
  ],
  "estimatedTime": "total minutes",
  "signalFocus": "primary signal area"
}`;

  const response = await client.models.generateContent({
    model: MODEL_ID,
    contents: prompt,
    config: {
      systemInstruction: buildSystemPrompt(),
      responseMimeType: "application/json",
      temperature: 0.5,
    },
  });

  const text = response.text;
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("AI response was not valid JSON");
  }
}

/**
 * Format AST analysis summary for the AI prompt.
 */
function formatASTSummary(astAnalysis) {
  if (!astAnalysis || Object.keys(astAnalysis).length === 0) {
    return "No AST analysis available.";
  }

  return Object.entries(astAnalysis)
    .map(([repo, data]) => {
      const s = data.summary;
      if (!s) return `**${repo}**: No parseable files.`;
      return `**${repo}**: ${s.totalFiles} files, ${s.totalLines} lines, ${s.totalFunctions} functions, ${s.totalClasses} classes, avg complexity: ${s.avgComplexity}, async usage: ${s.asyncUsage}, hooks: [${s.hooksUsed.join(", ")}], error handling: ${s.errorHandling} try/catch blocks`;
    })
    .join("\n");
}
