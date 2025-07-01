import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import search from "../images/search.webp";
import chat from "../images/chat.png";
import submit from "../images/submit.jpg"
import Footer from '../components/Footer';
import "./homePage.css"
import { Link } from "react-router-dom";
import { useEffect } from 'react';

function HomePage() {
  const [ligCol, setLigCol] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLigCol((prevLigCol) => !prevLigCol); // Use functional update to toggle based on previous state
    }, 500); // 0.5 seconds = 500 milliseconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div id="home" class="user-select-none">
        <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center p-4 pt-5">
          <div className="text-center mb-5 ">
            <h1 className="text-shadow-darkblue display-4 fw-bold text-light pt-4">Welcome to <spam className={`text-${ligCol ? 'primary' : 'light'}`}>Project Hub</spam></h1>
            <p className="lead text-secondary">
              Your central place to showcase, discover, and manage your creative projects.
              Get started by uploading your work or exploring projects from others.
            </p>
          </div>

          <div className="row gap-4 justify-content-center mb-5">
            {/* Upload Card */}
            <div className="card hover-grow bg-transparent border border-primary text-white col-12 col-sm-4 col-md-4 p-4 rounded">

              <h5 className="card-title text-primary"> Upload Your Project</h5>
              <p className="card-text text-primary">
                Share your latest creation with the world. Provide details and links.
              </p>
              <Link to="/upload" className='nav-link text-light d-flex align-item-center justify-content-center' >

                <button className="btn btn-outline-primary">Upload Now →</button></Link>
            </div>

            {/* Explore Card */}
            <div className="card bg-transparent border border-primary hover-grow bg-primary text-white col-12 col-sm-4 col-md-4 p-4 rounded d-flex align-item-center justify-content-center">
              <h5 className="card-title text-primary "> Explore Projects</h5>
              <p className="card-text text-primary">
                Discover interesting projects uploaded by others in the community.
              </p>
              <Link to="/project" className='nav-link text-light d-flex align-item-center justify-content-center'>
                <button className="btn btn-outline-primary">View Projects →</button></Link>
            </div>
          </div>

          {/* Info Box */}
          <div className="card hover-grow bg-secondary text-white p-4 rounded text-center col-md-8">
            <h5 className="card-title text-pink"> What is Project Hub?</h5>
            <p className="card-text text-light">
              A simple, elegant platform to manage and display your project portfolio. Whether you're a developer, designer, writer, or any kind of creator, Project Hub helps you organize your work and present it professionally.
            </p>
          </div>
        </div>

        <footer className="bg-dark text-light py-4 mt-auto">
          <div className="container text-center">
            <p className="mb-1">Created with passion by <strong>Sanjai</strong> as part of my resume portfolio.</p>
            <small>&copy; {new Date().getFullYear()} @sanjai.All rights reserved.</small>
          </div>
        </footer>

      </div>


    </>
  );
}

export default HomePage;



{/* <div id="cont" className='h-100 '>
  <div className="container">
    <header className="jumbotron my-4">
      <h1 className="display-3">Welcome to Our Project Portal</h1>
      <p className="lead">Explore the future with our AI-powered features.</p>
      <a href="#features" className="btn btn-danger btn-lg">Learn More</a>
    </header>

    <div className="row text-center">
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card h-100">
          <img className="card-img-top h-75" src={search} alt="Search Projects" />
          <div className="card-body">
            <h4 className="card-title">Search Projects</h4>
            <p className="card-text">Search and download mini and major project details of ex-students.</p>
          </div>
          <div className="card-footer">
            <Link className="btn btn-danger" to="/project">Find Out More!</Link>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card h-100">
          <img className="card-img-top h-75" src={chat} alt="AI Chat" />
          <div className="card-body">
            <h4 className="card-title">AI Chat</h4>
            <p className="card-text">Chat with our AI to get details about projects and clarify your doubts.</p>
          </div>
          <div className="card-footer">
            <Link className="btn btn-danger" to="/project">Find Out More!</Link>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card h-100">
          <img className="card-img-top h-75" src={submit} alt="Project Submission" />
          <div className="card-body">
            <h4 className="card-title">Project Submission</h4>
            <p className="card-text">Submit your own projects and contribute to our growing repository.</p>
          </div>
          <div className="card-footer">
            <Link className="btn btn-danger" to="/upload">Find Out More!</Link>
          </div>
        </div>
      </div>
    </div>

  </div>
  <Footer />
</div> */}

