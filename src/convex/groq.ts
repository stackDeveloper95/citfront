import { action } from "./_generated/server";
import { v } from "convex/values";
import fetch from "node-fetch";


const GROQ_API_KEY="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"
export const askGroq = action({
  args: {
    prompt: v.string(),
  },
  handler: async (_, { prompt }) => {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "Answer ONLY using the provided context. If not found, say 'I don't know'. Return valid HTML only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices?.length) {
      throw new Error("Groq returned no response");
    }

    return data.choices[0].message.content;
  },
});
