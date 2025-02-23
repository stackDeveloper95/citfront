import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import search from "../images/search.webp";
import chat from "../images/chat.png";
import submit from "../images/submit.jpg"
import Footer from '../components/Footer';
import "./home.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
     <>
    <div id="home"  >
    <Navbar/>
    <div id="cont" className='h-100 '>
    <div  className="container">
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
    <Footer/>
    </div>
   
    </div>
    

    </>
  );
}

export default HomePage;
