import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import "./chat.css";

const ChatPage = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const createEmbedding = useAction(api.myAction.search);
  const askGroq = useAction(api.groq.askGroq);

  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "Give me a 3-bullet summary",
    "List the key decisions mentioned",
    "What are the next steps?",
    "Extract dates and owners",
  ];

  const handleSend = async () => {
    if (loading || !input.trim()) return;

    const userMessage = input.trim();
    const nextMessages = [...messages, { type: "human", data: userMessage }];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // 🔍 Vector Search
      const data = await createEmbedding({
        query: userMessage,
        fileId: id,
      });

      const retrievedChunks = JSON.parse(data);

      const memoryWindow = nextMessages
        .slice(-5)
        .map((m) =>
          m.type === "human"
            ? `User: ${m.data}`
            : `Assistant: ${m.data}`
        )
        .join("\n");

      const PROMPT = `
You are a helpful PDF-based AI assistant.

--- Conversation History ---
${memoryWindow}

--- Retrieved Content ---
${retrievedChunks}

--- User Message ---
${userMessage}

Rules:
1. If the user greets (hi, hello, hey, good morning, etc):
   - Reply politely and ask how you can help.
   - Do NOT use retrieved content.

2. If the user says thanks or thank you:
   - Reply politely like "You're welcome 😊"

3. If the user says bye or goodbye:
   - Reply politely and end the conversation.

4. For normal questions:
   - Answer ONLY using Retrieved Content.
   - If answer is not found, say: "I don't know."

5. Respond in VALID HTML only.
6. Allowed tags: <p>, <strong>, <ul>, <li>
`;

      const htmlResponse = await askGroq({ prompt: PROMPT });

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlResponse, "text/html");
      const textContent = doc.body.textContent.trim();

      setMessages((prev) => [...prev, { type: "ai", data: textContent }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "ai", data: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-glow" />

      <div className="chat-shell">
        <div className="chat-header">
          <div>
            <p className="eyebrow">PDF Copilot</p>
            <h1>Chat with your document</h1>
            <p className="lede">
              Ask focused questions and get answers grounded in the file.
            </p>
          </div>
          <div className={`status ${loading ? "pulse" : "ready"}`}>
            <span className="dot" />
            {loading ? "Thinking" : "Ready"}
          </div>
        </div>

        <div className="chat-card">
          <div className="chat-stream">
            {messages.length === 0 && (
              <div className="chat-empty">
                <div>
                  <p className="eyebrow">No messages yet</p>
                  <h3>Start the conversation</h3>
                  <p>
                    I will pull answers from the uploaded PDF. Try one of
                    these starters or ask your own.
                  </p>
                </div>

                <div className="prompt-chips">
                  {samplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="chip"
                      disabled={loading}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`bubble ${msg.type}`}>
                <div className="bubble-label">
                  {msg.type === "human" ? "You" : "AI Assistant"}
                </div>
                <div className="bubble-body">{msg.data}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the PDF, hit Enter to send"
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="send-btn"
              aria-label="Send message"
            >
              <SendIcon fontSize="small" />
            </button>
          </div>

          {loading && (
            <div className="typing">
              <span />
              <span />
              <span />
              <p>Pulling context from your file…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const { id } = useParams();
  const projects = useQuery(api.project.getByFileId, { fileId: id });

  if (!projects?.length) return null;

  return (
    <>
      <Navbar />
      <ChatPage id={projects[0].fileId} />
    </>
  );
};

export default Chat;
