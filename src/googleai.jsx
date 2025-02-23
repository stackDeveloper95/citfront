const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = "AIzaSyApcFS8Bdfas55ud50j-ulNTN0nO9-l1Kk";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
 
    export const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
//     const result = await chatSession.sendMessage(prompt);
//     console.log(result.response.text());
//     return result.response.text();
//   }
  
  