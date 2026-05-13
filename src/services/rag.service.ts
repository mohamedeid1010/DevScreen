import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import cosineSimilarity from "compute-cosine-similarity";
import { generateEmbedding } from "./embedding.service";
import { AstService } from "./ast.service";

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

  public async evaluateCandidateCode(jobDescription: string, repoCode: Record<string, any[]>): Promise<any> {
    console.log("Embedding job description...");
    const jobVector = await generateEmbedding(jobDescription);

    let allChunks: { content: string, file: string, repo: string, complexity: number }[] = [];

    console.log("Parsing and chunking candidate code...");
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

    // Limit to the top 10 most complex chunks to avoid massive HF API wait times
    const chunksToEmbed = allChunks.sort((a,b) => b.complexity - a.complexity).slice(0, 10);
    
    console.log(`Embedding ${chunksToEmbed.length} code chunks via CodeBERT...`);
    const results = [];
    for (const chunkData of chunksToEmbed) {
       try {
           const chunkVector = await generateEmbedding(chunkData.content);
           const similarity = cosineSimilarity(jobVector, chunkVector) || 0;
           results.push({
               ...chunkData,
               similarity
           });
       } catch (e) {
           console.warn("Failed to embed chunk", e);
       }
    }

    results.sort((a, b) => b.similarity - a.similarity);
    
    return results;
  }
}