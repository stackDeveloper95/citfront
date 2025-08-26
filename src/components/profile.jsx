import React from "react";
import "./profilepage.css";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link } from "react-router-dom";

const ProfilePage = ({ projects }) => {
  return (
    <div
      className="container-fluid py-4"
      style={{ minHeight: "80vh", marginTop: "200px" }}
    >
      <div className="row g-4" style={{ margin: "80px" }} >

        <div className="col-12 col-lg-6 d-flex flex-column gap-3">
          {projects.map((project, index) => (
            <div key={index}>
              <div className="bg-white rounded shadow-sm d-flex justify-content-between align-items-center p-3 mb-2">
                <h2 className="h6 mb-0 text-secondary">Type:</h2>
                <span className="text-primary">{project.type}</span>
              </div>

              <div
                className="bg-white shadow-sm rounded-4 p-3"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
              >
                <div className="d-flex justify-content-center">
                  <img
                    src={project.images}
                    alt="Project"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "300px",
                      width: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Details */}
        <div className="col-12 col-lg-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-4 p-4 mb-4"
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
            >
              {/* Header */}
              <div className="d-flex align-items-center mb-3 flex-wrap">
                <img
                  src={project.images}
                  alt="Profile"
                  className="rounded-circle me-3"
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover"
                  }}
                />
                <div>
                  <h5 className="mb-1 text-dark">{project.projectName}</h5>
                  <p className="text-muted mb-0">
                    {project.desc || "No description available"}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-3 mt-3">
                <Link
                  to={`/chat/${project.fileId}`}
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                >
                  <AutoAwesomeIcon />
                  Chat with PDF
                </Link>
                <a
                  href={project.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success"
                >
                  View PDF
                </a>
              </div>
              <div className="pt-2">
                <p className="text-dark mb-0">
                  View the PDF, and ask the AI if you have any questions <AutoAwesomeIcon />
                </p>
              </div>

              {/* Team Members */}
              <div className="mt-4">
                <h6>Team Members</h6>
                <ul className="list-group rounded shadow-sm">
                  {["no1", "no2", "no3", "no4"].map((key, idx) => {
                    const member = project[key];
                    return (
                      member && (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {`No ${idx + 1}: ${member}`}
                          <span className="badge bg-primary rounded-pill">Member</span>
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
