import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import Person4Icon from "@mui/icons-material/Person4";
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

  const isGreeting = (text) => {
    const greetings = [
      "hi",
      "hello",
      "hey",
      "hai",
      "thanks",
      "thank you",
      "ok thank you",
      "ok thanks",
      "ok bye",
      "bye",
      "good morning",
      "good evening",
      "good afternoon"
    ];

    return greetings.some(greet =>
      text.toLowerCase().trim().startsWith(greet)
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "human", data: input }]);
    setLoading(true);

    // ✅ Handle greetings without RAG / Groq
    if (isGreeting(input)) {
      let reply = "Hello! 👋 How can I help you today?";

      if (input.toLowerCase().includes("thank")) {
        reply = "You're welcome 😊 Happy to help!";
      } else if (input.toLowerCase().includes("bye")) {
        reply = "Goodbye 👋 Have a great day!";
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "ai", data: reply }]);
        setLoading(false);
      }, 500);

      setInput("");
      return; // ⛔ stop here (important)
    }

    try {
      // 🔍 Vector Search
      const data = await createEmbedding({
        query: input,
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
You are a PDF answering assistant.

--- Conversation History ---
${memoryWindow}

--- Retrieved Content ---
${retrievedChunks}

--- Question ---
${input}

Rules:
- Answer ONLY from retrieved content
- Respond in valid HTML only
- Use <p>, <strong>, <ul>, <li>
- If not found, say "I don't know"
`;

      const htmlResponse = await askGroq({ prompt: PROMPT });

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlResponse, "text/html");
      const textContent = doc.body.textContent.trim();

      setMessages((prev) => [...prev, { type: "ai", data: textContent }]);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container-fluid bg-dark text-light d-flex flex-column p-2 p-md-3"
      style={{ height: "100vh" }}>

      <h5 className="text-center mb-2 mb-md-3">
        <AutoAwesomeIcon /> Chat with Project Assistant
      </h5>

      {/* Chat Messages */}
      <div
        className="flex-grow-1 overflow-auto p-2 p-md-3 mb-2"
        style={{
          backgroundColor: "#1e1f2b",
          borderRadius: "10px"
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${msg.type === "human"
              ? "justify-content-end"
              : "justify-content-start"}`}
          >
            <div
              className="d-flex align-items-end"
              style={{ maxWidth: "85%" }}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center
                ${msg.type === "human" ? "bg-primary" : "bg-secondary"}
                text-light me-2`}
                style={{ width: 30, height: 30 }}
              >
                {msg.type === "human" ? <Person4Icon /> : <AutoAwesomeIcon />}
              </div>

              <div
                className={`p-2 px-3 rounded shadow-sm
                ${msg.type === "human" ? "bg-primary" : "bg-secondary"}`}
                style={{
                  wordBreak: "break-word",
                  fontSize: "0.95rem"
                }}
              >
                {msg.data}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="d-flex align-items-center border rounded-pill p-2">
        <input
          className="form-control bg-dark text-light border-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="btn btn-primary rounded-circle ms-2"
          onClick={handleSend}
          disabled={loading}
          style={{ width: 40, height: 40 }}
        >
          <SendIcon fontSize="small" />
        </button>
      </div>

      {loading && (
        <p className="text-muted text-center mt-1">Thinking...</p>
      )}
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
