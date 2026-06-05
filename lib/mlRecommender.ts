import { GoogleGenAI } from "@google/genai";

const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

// EMBEDDING
async function getEmbedding(
  text: string
): Promise<number[]> {

  if (!ai) return [];

  try {

    const response =
      await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text,
      });

    if (
      response.embeddings?.[0]?.values
    ) {
      return response.embeddings[0].values;
    }

    return [];

  } catch (error) {

    console.error(
      "⚠️ ML Embedding Error:",
      error
    );

    return [];
  }
}

// COSINE SIMILARITY
function cosineSimilarity(
  vecA: number[],
  vecB: number[]
): number {

  if (
    vecA.length === 0 ||
    vecB.length === 0
  ) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {

    dotProduct += vecA[i] * vecB[i];

    normA += vecA[i] * vecA[i];

    normB += vecB[i] * vecB[i];
  }

  return (
    dotProduct /
    (Math.sqrt(normA) * Math.sqrt(normB))
  );
}

// AI RECOMMENDER
export const recommendMoviesByAI =
  async (
    userMoodDescription: string,
    moviesList: any[]
  ) => {

    if (!ai || moviesList.length === 0) {
      return moviesList;
    }

    const userVector =
      await getEmbedding(
        userMoodDescription
      );

    if (userVector.length === 0) {
      return moviesList;
    }

    const scoredMovies =
      await Promise.all(

        moviesList.map(async (movie) => {

          const moviePlot =
            movie.Plot &&
            movie.Plot !== "N/A"
              ? movie.Plot
              : movie.Title;

          const movieVector =
            await getEmbedding(moviePlot);

          const similarityScore =
            cosineSimilarity(
              userVector,
              movieVector
            );

          // DEBUG
          console.log(
            movie.Title,
            "AI SCORE:",
            similarityScore
          );

          return {
            ...movie,
            aiScore: similarityScore,
          };
        })
      );

    return scoredMovies.sort(
      (a, b) => b.aiScore - a.aiScore
    );
  };