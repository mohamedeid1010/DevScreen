import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import cosineSimilarity from "compute-cosine-similarity";
import { generateEmbedding } from "./embedding.service";
import { AstService } from "./ast.service";
import { getOptionalSupabase, isMissingTableError } from "./supabase.service";
import crypto from "crypto";

export class RagService {
  private astService: AstService;

  constructor() {
    this.astService = new AstService();
  }

  public async chunkCode(code: string): Promise<string[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 200,
    });
    
    const docs = await splitter.createDocuments([code]);
    return docs.map(doc => doc.pageContent);
  }

  public async evaluateCandidateCode(
    jobDescription: string,
    repoCode: Record<string, any[]>,
    githubUsername?: string,
  ): Promise<any> {
    const jobVector = await generateEmbedding(jobDescription);

    let allChunks: { content: string, file: string, repo: string, complexity: number }[] = [];

    for (const [repoName, files] of Object.entries(repoCode)) {
      for (const file of files) {
        if (!file.content) continue;
        
        const chunks = await this.chunkCode(file.content);
        const fileComplexity = this.astService.calculateCyclomaticComplexity(file.content);

        for (const chunk of chunks) {
            allChunks.push({
                content: chunk,
                file: file.path,
                repo: repoName,
                complexity: fileComplexity
            });
        }
      }
    }

    // Cap to top 40 most complex chunks to prevent embedding model from taking too long
    const chunksToEmbed = [...allChunks]
      .sort((a, b) => b.complexity - a.complexity)
      .slice(0, 40);
    
    const embeddingRows: Array<{
      github_username: string;
      repo: string;
      file_path: string;
      content: string;
      content_hash: string;
      embedding: number[];
      complexity: number;
    }> = [];

    const settled = await Promise.all(
      chunksToEmbed.map(async (chunkData) => {
        try {
          const vec = await generateEmbedding(chunkData.content);
          const sim = cosineSimilarity(jobVector, vec) || 0;

          // Collect embedding data for DB persistence
          if (githubUsername) {
            embeddingRows.push({
              github_username: githubUsername,
              repo: chunkData.repo,
              file_path: chunkData.file,
              content: chunkData.content,
              content_hash: crypto.createHash("sha256").update(chunkData.content).digest("hex"),
              embedding: vec,
              complexity: chunkData.complexity,
            });
          }

          return {
            ...chunkData,
            similarity: sim,
          };
        } catch (e) {
          console.warn("Embed failed", e);
          return null;
        }
      })
    );

    // Save embeddings to Supabase
    if (githubUsername && embeddingRows.length > 0) {
      try {
        await this.saveEmbeddings(githubUsername, embeddingRows);
      } catch (e) {
        console.warn("Failed to save embeddings to DB:", e);
      }
    }

    const results = settled.filter(
      (result): result is typeof chunksToEmbed[number] & { similarity: number } => result !== null
    );

    // Return top 10 chunks ranked by similarity
    const topBySimilarity = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    return topBySimilarity;
  }

  private async saveEmbeddings(
    githubUsername: string,
    rows: Array<{
      github_username: string;
      repo: string;
      file_path: string;
      content: string;
      content_hash: string;
      embedding: number[];
      complexity: number;
    }>
  ) {
    const supabase = getOptionalSupabase();
    if (!supabase) return;

    const table = supabase.from("code_embeddings") as any;

    // Delete old embeddings for this user before inserting new ones
    await table.delete().eq("github_username", githubUsername);

    // Insert in batches of 50 to avoid payload limits
    const batchSize = 50;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error } = await table.insert(batch);

      if (error) {
        if (isMissingTableError(error, "code_embeddings")) {
          return;
        }
        console.warn(`Embedding batch ${i / batchSize + 1} failed:`, error.message);
      }
    }

    console.log(`Saved ${rows.length} embeddings for @${githubUsername}`);
  }
}