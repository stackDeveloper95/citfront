import React from 'react';
import "./nav.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [ligCol, setLigCol] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setLigCol(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg nav-shell fixed-top ${ligCol ? 'nav-solid' : ''}`}>
      <div className="container-fluid nav-inner">
        <Link className="navbar-brand nav-brand" to="/">
          Project Hub
        </Link>

        <button
          className="navbar-toggler nav-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-lg-2">
            <li className="nav-item">
              <Link to="/" className="nav-link nav-link-custom" end>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/project" className="nav-link nav-link-custom">
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/upload" className="nav-link">
                <span className="primary-btn nav-cta">Upload a Project</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;