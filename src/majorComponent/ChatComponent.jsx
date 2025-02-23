import React, { useState, useRef, useEffect } from "react";
import "./home.css"; // Add styling here or use inline styles
import Navbar from "../components/Navbar";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAction } from "convex/react";
import {chatSession} from "../googleai"




const ChatPage = ({ id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const createEmbedding = useAction(api.myAction.search);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const inputdata = { type: "human", data: input };
      setMessages((prevMessages) => [...prevMessages, inputdata]);

      setLoading(true); // Set loading to true before starting the API call

      try {
        const data = await createEmbedding({
          query: input,
          fileId: id,
        });

        const unformatedData = JSON.parse(data);
        console.log(unformatedData)
        const PROMPT = `
        You are a PDF answering assistant. Respond to the question: "${input}" using only the provided content. Your response must be strictly in **well-structured HTML format** and include appropriate tags such as:
        
        - Use <p> for paragraphs.
        - Use <strong> for emphasizing key points or terms.
        - Use <ul> and <li> for lists if the response contains multiple points.
        
        If the question contains only a greeting (e.g., "hai"), respond in HTML like this:
        <p><strong>Hello!</strong> How can I assist you today?</p>
        
        Strictly exclude unnecessary content and focus on providing clear, concise, and formatted answers based on the provided content. 
        
        The provided content is: ${unformatedData}.
        `;
        
        


        const aimodelResult = await chatSession.sendMessage(PROMPT);
        console.log(aimodelResult.response.text)
        const htmlBlock = aimodelResult.response.text().replace('```',"").replace("html","").replace("```","");
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlBlock, 'text/html');
         const textContent = doc.body.textContent.trim();
         console.log(textContent)

        const receiveData = { type: "ai", data: textContent };
        setMessages((prevMessages) => [...prevMessages, receiveData]);
        console.log(messages)

        setInput("");
      } catch (error) {
        console.error("Error in sending message:", error);
      } finally {
        setLoading(false); // Set loading to false once the API call is complete
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const onClickSpeech = (text) => {
    setIsSpeechEnabled(!isSpeechEnabled);
    if (isSpeechEnabled) {
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
    <div className="chat-container">
      <header className="my-4">
        <h5 className="display-9 text-center">
          <AutoAwesomeIcon /> AI Chat With PDF
        </h5>
      </header>
      <div
        className="messages-container bg-dark"
        ref={messagesContainerRef}
        style={{
          height: "89%",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div className="messageMain">
          <div className={`message ${msg.type} row`} key={index}>
            {msg.type === "human" ? (
              <div className="col-10">{msg.data}</div>
            ) : (
             <div  className="col-12">{msg.data}</div>
            )}
            <div className="icon col-2" onClick={() => onClickSpeech(msg.data)}>
              <VolumeUpIcon />
            </div>
          </div>
          
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
        {loading && <div className="loader">Loading...</div>} {/* Loader */}
      </div>
    </div>
  );
};



const PdfViewer = ({ url }) => (
  <iframe
    src={url}
    title="PDF Viewer"
    style={{ width: "100%", height: "100%", border: "none" }}
  />
);

const Chat = () => {
  const {id}=useParams();
  const projects = useQuery(api.project.getByFileId, { fileId: id });
  const project=projects[0];

  return (
    <>
    <Navbar/>
    <div className="app-container" id="main">
      <div className="left-pane">
        <ChatPage id={project.fileId}/>
      </div>
      <div className="right-pane">
        <PdfViewer url={project.pdf} />
      </div>
    </div>
    </>
  );
};

export default Chat;
