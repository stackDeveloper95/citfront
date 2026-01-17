import React from "react";
import "./profilepage.css";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link } from "react-router-dom";

const ProfilePage = ({ projects }) => {
  return (
    <div className="page-shell profile-shell">
      <div className="row g-4 profile-grid">
        <div className="col-12 col-lg-5 d-flex flex-column gap-3">
          {projects.map((project, index) => (
            <div key={index} className="glass hero-card">
              <div className="type-pill">{project.type}</div>
              <div className="hero-image" style={{ backgroundImage: `url(${project.images})` }} />
            </div>
          ))}
        </div>

        <div className="col-12 col-lg-7">
          {projects.map((project, index) => (
            <div key={index} className="glass detail-card">
              <div className="detail-head">
                <img
                  src={project.images}
                  alt="Profile"
                  className="avatar"
                />
                <div>
                  <h5 className="mb-1">{project.projectName}</h5>
                  <p className="mb-0 detail-desc">{project.desc || "No description available"}</p>
                </div>
              </div>

              <div className="detail-actions">
                <Link to={`/chat/${project.fileId}`} className="primary-btn">Chat with PDF</Link>
                <a
                  href={project.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn"
                >
                  View PDF
                </a>
              </div>
              <p className="helper-text">Open the PDF or ask the AI anything about it.</p>

              <div className="team">
                <h6>Team</h6>
                <ul className="team-list">
                  {["no1", "no2", "no3", "no4"].map((key, idx) => {
                    const member = project[key];
                    return (
                      member && (
                        <li key={idx} className="team-row">
                          <span>{`Member ${idx + 1}`}</span>
                          <span className="chip">{member}</span>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
