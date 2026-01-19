import React from 'react';
import './app.css';
import Upload from './majorComponent/Upload.jsx';
import HomePage from './majorComponent/HomePage.jsx';
import Project from './majorComponent/project.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './majorComponent/Profile.jsx';
import Chat from './majorComponent/ChatComponent.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  return (
    <div id="app">
      <Router>
        <Navbar />
        <div className="bg-transparent min-w-full min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/project" element={<Project />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;

