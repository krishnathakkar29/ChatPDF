import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function getEmbeddings(text: string) {
  try {
    const response = await model.embedContent(text.replace(/\n/g, " "));

    return response.embedding.values as number[];
  } catch (error) {
    console.log("error calling embeddings api", error);
    throw error;
  }
}
