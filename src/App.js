import React from 'react';
import "./app.css"
import Upload from './majorComponent/Upload.jsx';
import HomePage from './majorComponent/HomePage.jsx';
import Project from './majorComponent/project.jsx';
import { useQuery, useMutation } from "convex/react";
import { api } from "./convex/_generated/api.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from 'react';
import PdfLoaderFromLocalFile from './components/LoadPdf.jsx';
import Profile from './majorComponent/Profile.jsx';
import Chat from './majorComponent/ChatComponent.jsx';
import Navbar from './components/Navbar.jsx';
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";




const App = () => {

  const tasks = useQuery(api.project.get);
  const user = useMutation(api.project.createTask);
  const [message, setMessage] = useState('');

  // const submit=async()=>{
  //   const result=await user({ projectName: "mass making", desc: "ok", images: "url", pdf: "url", type: "mini", no1: "guru", no2: "hari", no3: "sanjai", no4: "gokul" })
  //   console.log(result)

  // }

  useEffect(() => {
    const fun = async () => {
      // const loader = new PDFLoader();

      //  const docs = await loader.load();
      //  console.log(docs);

    }
    fun()

  }, []);








  return (
    <div id="app" > {/* <div className="alert alert-warning alert-dismissible fade show" role="alert"> <strong>Holy guacamole!</strong> You should check in on some of those fields below. <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> </div> */}
      <Router>
        <Navbar />
        <div className="bg-transparent">
          <Routes>
            <Route path="/" element={<HomePage />}> </Route>
            <Route path="/upload" element={<Upload />} ></Route>
            <Route path="/project" element={<Project />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Routes>
          {/* <Routes>

            <Route path="/" element={<HomePage />} />
            />
           
           
           
          </Routes> */}
        </div>
        {/* */}
      </Router>

      {/* <PdfLoaderFromLocalFile/> */}
    </div>
  )
}

export default App
