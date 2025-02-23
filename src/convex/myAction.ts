import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { v } from "convex/values";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

// export const ingest = action({
//   args: {
//     textdata: v.array(v.string()), // Array of text strings
//     fileId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     try {
//       console.log("Text data received:", args.textdata);

//       const metadata = args.textdata.map(() => ({ fileId: args.fileId }));

//       // Ensure the ConvexVectorStore operation is awaited properly
//       await ConvexVectorStore.fromTexts(
//         args.textdata,
//         metadata,
//         new GoogleGenerativeAIEmbeddings({
//           apiKey: "AIzaSyApcFS8Bdfas55ud50j-ulNTN0nO9-l1Kk",
//           model: "text-embedding-004", // Check the embedding model's dimensions
//           taskType: TaskType.RETRIEVAL_DOCUMENT,
//           title: "Document title",
//         }),
//         { ctx }
//       );

//       console.log("Data successfully ingested.");
//     } catch (error) {
//       console.error("Error ingesting data:", error);
//       throw new Error("Data ingestion failed.");
//     }
//   },
// });


export const ingest = action({
  args:{
    texts:v.array(v.string()),
    metaData:v.string()

  },
  handler: async (ctx,args) => {
    try {
      // Hardcoded data
      const texts = ["Hello world", "Bye bye", "What's this?"];
      const metadata = [{ prop: 2 }, { prop: 1 }, { prop: 3 }];
      
      // Ensure ConvexVectorStore.fromTexts is awaited
      await ConvexVectorStore.fromTexts(
        args.texts,
        {metadata:{fileId:args.metaData}},
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyApcFS8Bdfas55ud50j-ulNTN0nO9-l1Kk",
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
    const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings({
      apiKey: "AIzaSyApcFS8Bdfas55ud50j-ulNTN0nO9-l1Kk",
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
