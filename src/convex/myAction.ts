import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { v } from "convex/values";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

const genaiKey = process.env.GOOGLE_GENAI_API_KEY;

export const ingest = action({
  args:{
    texts:v.array(v.string()),
    metaData:v.string()

  },
  handler: async (ctx,args) => {
    try {
      if (!genaiKey) {
        throw new Error("Missing GOOGLE_GENAI_API_KEY in environment");
      }
      // Hardcoded data
    
      // Ensure ConvexVectorStore.fromTexts is awaited
      await ConvexVectorStore.fromTexts(
        args.texts,
        {metadata:{fileId:args.metaData}},
        new GoogleGenerativeAIEmbeddings({
          apiKey: genaiKey,
          model: "text-embedding-004", // Ensure the embedding model's dimensions are correct
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );

      // If ConvexVectorStore itself performs mutations, ensure they're awaited too.

      // Return success message after completion
      return "completed";
    } catch (err) {
      // Catch and return any errors that occur during the process
      console.error("Error during ingestion:", err);
      return { error: err.message || 'An error occurred' };
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!genaiKey) {
      throw new Error("Missing GOOGLE_GENAI_API_KEY in environment");
    }
    const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings({
      apiKey: genaiKey,
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    }), { ctx });

    const results = await vectorStore.similaritySearch(args.query, 10); // Adjust the number of results
    results.filter(q => q.metadata.metadata.fileId== args.fileId);
    console.log(results);
    const combinedText = results.map((result) => result.pageContent).join(" ");

    return JSON.stringify(combinedText);
  },
});
