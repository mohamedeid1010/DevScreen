// MPNet and codeBERT and store in DB

import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";

dotenv.config();

// Supabase
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY exists:", !!process.env.SUPABASE_KEY);

// Lazy load model
let embedderPromise: Promise<any> | null = null;

export const getEmbedder = async () => {
    if (!embedderPromise) {
        embedderPromise = pipeline("feature-extraction", "Xenova/all-mpnet-base-v2");
    }
    return embedderPromise;
};

export const generateEmbedding = async (text: string) => {
    const embedder = await getEmbedder();
    const output = await embedder(text, {
        pooling: "mean",
        normalize: true
    });
    return Array.from(output.data);
};

export const getAllCandidates = async () => {
    const { data, error } = await supabase
        .from("candidates")
        .select("*");

    if (error) throw error;
    return data;
};

export interface CandidateInput {
    github_username: string;
    profile_text: string;
}

export const processCandidates = async (candidates: CandidateInput[]) => {
    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
        throw new Error("candidates array is required");
    }

    if (candidates.length > 50) {
        throw new Error("max 50 candidates per request");
    }

    const results = await Promise.all(
        candidates.map(async (candidate) => {
            const { github_username, profile_text } = candidate;

            try {
                // Check for duplicates
                const { data: existing } = await supabase
                    .from("candidates")
                    .select("id")
                    .eq("profile_text", profile_text)
                    .maybeSingle();

                if (existing) {
                    console.log("Already exists:", profile_text);
                    return { github_username, profile_text, status: "already exists", id: existing.id };
                }

                console.log("Embedding:", profile_text);
                const vector = await generateEmbedding(profile_text);
                console.log("Vector size:", vector.length);

                const { data, error } = await supabase
                    .from("candidates")
                    .insert([{
                        github_username,
                        profile_text,
                        embedding: vector
                    }])
                    .select();

                if (error) {
                    console.error("Supabase insert error:", error);
                    return { github_username, profile_text, status: "error", error };
                }

                console.log("Inserted:", github_username);
                return { github_username, profile_text, status: "inserted", inserted: data };
            } catch (err) {
                console.error("CAUGHT ERROR processing candidate:", err);
                return { github_username, profile_text, status: "error", error: String(err) };
            }
        })
    );

    return results;
};