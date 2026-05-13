let extractor: any = null;

async function getExtractor() {
    if (!extractor) {
        const { pipeline } = await import("@xenova/transformers");
        extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    return extractor;
}

export const generateEmbedding = async (text: string): Promise<number[]> => {
    // The first call downloads the local model (~25MB), then reuses the cached pipeline for the process lifetime.
    const currentExtractor = await getExtractor();
    const result = await currentExtractor(text, { pooling: "mean", normalize: true });

    return Array.from(result.data);
};