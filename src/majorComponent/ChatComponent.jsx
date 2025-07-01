import React, { useState, useRef, useEffect } from "react"; // Add styling here or use inline styles
import Navbar from "../components/Navbar";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAction } from "convex/react";
import { chatSession } from "../googleai";
import SendIcon from '@mui/icons-material/Send';
import Person4Icon from '@mui/icons-material/Person4';



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
        const htmlBlock = aimodelResult.response.text().replace('```', "").replace("html", "").replace("```", "");
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
    <div className="container-fluid bg-dark text-light   d-flex flex-column p-3">
      <h4 className="text-center text-light mb-3"><AutoAwesomeIcon />   Chat with Project Assistant</h4>

      <div
        className=" overflow-auto p-3 mb-3 "
        ref={messagesContainerRef}
        style={{ borderRadius: "10px", height: "620px", backgroundColor: "#1e1f2b" }}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex mb-3 ${msg.type === 'human' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`d-flex ${msg.type === 'human' ? 'flex-row-reverse' : 'flex-row'} align-items-end`}>
              <div className="rounded-circle bg-primary text-dark fw-bold d-flex align-items-center justify-content-center me-2 ms-2 border bordar-light" style={{ width: "26px", height: "26px" }}>
                {msg.type === 'human' ? <Person4Icon /> : <AutoAwesomeIcon />}
              </div>
              <div className={`p-2 px-3 rounded shadow-sm ${msg.type === 'human' ? 'bg-primary text-light' : 'bg-secondary text-light'}`}>
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
          <i className="bi bi-send"> <SendIcon /></i>
        </button>
      </div>

      {loading && (
        <div className="text-center text-muted small mt-2">Loading...</div>
      )}
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
  const { id } = useParams();
  const projects = useQuery(api.project.getByFileId, { fileId: id });
  const project = projects[0];

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "50px", height: "400px" }} className="app-container bg-dark text-light vh-100 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div style={{ height: "750px" }} className=" col-12 col-md-10 col-lg-8 col-xl-6 ">
              <ChatPage id={project.fileId} />
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Chat;
