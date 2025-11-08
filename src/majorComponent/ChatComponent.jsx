import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useParams } from "react-router-dom";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { chatSession } from "../googleai";
import SendIcon from '@mui/icons-material/Send';
import Person4Icon from '@mui/icons-material/Person4';

const ChatPage = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const createEmbedding = useAction(api.myAction.search);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "human", data: input }]);
    setLoading(true);

    try {
      // 🔹 Search for matching embeddings
      const data = await createEmbedding({ query: input, fileId: id });
      console.log("🔹 Retrieved content:", data);

      // 🔹 Combine recent memory window
      const memoryWindow = messages
        .slice(-5)
        .map((m) => (m.type === "human" ? `User: ${m.data}` : `Assistant: ${m.data}`))
        .join("\n");

      const PROMPT = `
        You are a PDF answering assistant. Use the conversation history and provided content to answer clearly.
        --- Conversation History ---
        ${memoryWindow}

        --- User's Current Question ---
        ${input}

        --- Retrieved Content ---
        ${data}

        Rules:
        - Respond in simple HTML (<p>, <strong>, <ul>, <li>)
        - Keep it concise and focused on the provided content.
      `;

      // 🔹 Call AI model
      const aimodelResult = await chatSession.sendMessage(PROMPT);
      const htmlBlock = aimodelResult.response.text().replace(/```html|```/g, "");
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlBlock, "text/html");
      const textContent = doc.body.textContent.trim();

      setMessages((prev) => [...prev, { type: "ai", data: textContent }]);
      setInput("");
    } catch (err) {
      console.error("❌ Error in sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSend();

  const toggleSpeech = (text) => {
    setIsSpeechEnabled(!isSpeechEnabled);
    if (!isSpeechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container-fluid bg-dark text-light d-flex flex-column p-3">
      <h4 className="text-center mb-3"><AutoAwesomeIcon /> Chat with Project Assistant</h4>

      <div className="overflow-auto p-3 mb-3"
        style={{ borderRadius: "10px", height: "620px", backgroundColor: "#1e1f2b" }}>
        {messages.map((msg, index) => (
          <div key={index}
            className={`d-flex mb-3 ${msg.type === 'human' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`d-flex ${msg.type === 'human' ? 'flex-row-reverse' : 'flex-row'} align-items-end`}>
              <div className="rounded-circle bg-primary text-dark fw-bold d-flex align-items-center justify-content-center me-2 ms-2 border border-light"
                style={{ width: "26px", height: "26px" }}>
                {msg.type === 'human' ? <Person4Icon /> : <AutoAwesomeIcon />}
              </div>
              <div className={`p-2 px-3 rounded shadow-sm ${msg.type === 'human'
                ? 'bg-primary text-light'
                : 'bg-secondary text-light'}`}>
                <div>{msg.data}</div>
                <div className="text-muted small text-end mt-1" style={{ fontSize: "0.75rem" }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="d-flex align-items-center border border-light rounded-pill p-2">
        <input
          type="text"
          className="form-control bg-dark border-0 text-light me-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button className="btn btn-primary rounded-circle" onClick={handleSend} disabled={loading}>
          <SendIcon />
        </button>
      </div>

      {loading && <div className="text-center text-muted small mt-2">Loading...</div>}
    </div>
  );
};

const Chat = () => {
  const { id } = useParams();
  const projects = useQuery(api.project.getByFileId, { fileId: id });

  if (!projects) return <div>Loading project...</div>;
  if (!projects.length) return <div>No project found.</div>;

  const project = projects[0];

  return (
    <>
      <Navbar />
      <div className="app-container bg-dark text-light vh-100 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div style={{ height: "750px" }} className="col-12 col-md-10 col-lg-8 col-xl-6">
              <ChatPage id={project.fileId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
