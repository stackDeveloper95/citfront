import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const ChatPage = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const createEmbedding = useAction(api.myAction.search);
  const askGroq = useAction(api.groq.askGroq);

  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { type: "human", data: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // 🔍 Vector Search
      const data = await createEmbedding({
        query: userMessage,
        fileId: id,
      });

      const retrievedChunks = JSON.parse(data);

      const memoryWindow = messages
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
    <div
      className="d-flex flex-column"
      style={{
        height: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        marginTop: "56px",
      }}
    >
      {/* Messages */}
      <div
        className="flex-grow-1 overflow-auto px-3 py-4"
        style={{ backgroundColor: "#0f172a" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-4 ${msg.type === "human"
              ? "justify-content-end"
              : "justify-content-start"
              }`}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor:
                  msg.type === "human" ? "#2563eb" : "#1e293b",
                color: "#e5e7eb",
                lineHeight: "1.6",
                fontSize: "0.95rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.data}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="border-top px-3 py-3"
        style={{
          backgroundColor: "#020617",
          position: "sticky",
          bottom: 0,
        }}
      >
        <div
          className="d-flex align-items-center rounded-pill px-3 py-2"
          style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          <input
            className="form-control bg-transparent text-light border-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{ boxShadow: "none" }}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="btn text-light"
          >
            <SendIcon />
          </button>
        </div>

        {loading && (
          <p className="text-muted text-center mt-2">
            Assistant is typing…
          </p>
        )}
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
