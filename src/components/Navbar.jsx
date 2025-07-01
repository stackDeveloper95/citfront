import React from 'react'
import "./nav.css"
import project from "../images/project.png"
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';


const Navbar = () => {
  const [ligCol, setLigCol] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change condition based on your desired scroll threshold

      if (window.scrollY > 50) {
        console.log("sanjai")
        setLigCol(true);
      } else {
        setLigCol(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  return (
    <nav id="let" className={`navbar navbar-expand-lg navbar-dark px-3    bg-${ligCol ? "primary" : "transparent"} fixed-top`}>
      <Link className={`fostyle navbar-brand text-${ligCol ? "light" : "primary"}`} to="/">PROJECT HUB</Link>
      <button
        className="navbar-toggler primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto ">
          <li className="nav-item">
            <Link to="/" className="nav-link text-light " end>Home</Link>
          </li>
          <li className="nav-item text-primary  ">
            <Link to="/upload" className="nav-link text-light ">Upload</Link>
          </li>
          <li className="nav-item text-primary ">
            <Link to="/project" className="nav-link text-light ">Projects</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar