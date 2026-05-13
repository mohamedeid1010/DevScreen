// cosine similarity and ranking logic
import similarity from "compute-cosine-similarity";


export function showMatchScore(
  embedding1: number[],
  embedding2: number[]
): number {
  const score = similarity(embedding1, embedding2);

  if (score === null) {
    throw new Error("Failed to calculate similarity score.");
  }

  const formattedScore = Number((score * 100).toFixed(1));

  console.log(`Match Score: ${formattedScore}%`);

  return formattedScore;
}
