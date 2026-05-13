// MPNet and codeBERT and store in DB

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Supabase
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY exists:", !!process.env.SUPABASE_KEY);

export const generateEmbedding = async (text: string): Promise<number[]> => {
    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) throw new Error("Missing HUGGINGFACE_API_KEY in .env");

    const response = await fetch(
        "https://api-inference.huggingface.co/pipeline/feature-extraction/microsoft/codebert-base",
        {
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
        }
    );

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HF API Error: ${response.status} ${response.statusText} - ${errText}`);
    }

    const result = await response.json();
    
    // HF feature-extraction returns shape [1, seq_len, 768]
    // Apply mean pooling to convert to a single 1D vector (768)
    if (Array.isArray(result) && Array.isArray(result[0]) && Array.isArray(result[0][0])) {
        const tokens = result[0];
        const vectorSize = tokens[0].length;
        const pooled = new Array(vectorSize).fill(0);
        
        for (let token of tokens) {
            for (let i = 0; i < vectorSize; i++) {
                pooled[i] += token[i];
            }
        }
        for (let i = 0; i < vectorSize; i++) {
            pooled[i] /= tokens.length; // mean
        }
        
        // normalize vector
        const magnitude = Math.sqrt(pooled.reduce((acc, val) => acc + val * val, 0));
        return pooled.map(val => val / magnitude);
    } else if (Array.isArray(result) && Array.isArray(result[0])) {
        return result[0];
    } else if (Array.isArray(result)) {
        return result;
    }

    throw new Error("Unexpected embedding shape from HuggingFace API");
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