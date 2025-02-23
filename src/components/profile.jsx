import React from "react";
import "./profilepage.css";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link } from "react-router-dom";

const ProfilePage = ({ projects }) => {
  return (
    <div id="profile" className="container my-5">
      {projects.map((project, index) => (
        <div key={index} className="card card-transparent shadow-sm mb-4">
          <div
            className="card-body"
            style={{
              maxHeight: "85vh",
              overflowY: "scroll",
              paddingRight: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "rgba(249, 249, 249, 0.8)", // Slight transparency
            }}
          >
            <h1 className="card-title text-primary">{project.projectName}</h1>
            <p className="card-text">{project.desc}</p>

            <h5 className="mt-3">
              Project Type: <span className="badge bg-secondary">{project.type}</span>
            </h5>
            <h5 className="mt-3">
              Department: <span className="badge bg-info">{project.department}</span>
            </h5>

            <h3 className="mt-4">Project Prototype</h3>
            <div className="row mb-4">
              <div className="col-md-12">
                <img
                  src={project.images}
                  alt="Project Prototype"
                  className="img-fluid rounded shadow-sm"
                />
              </div>
            </div>

            <h3 className="mt-4">Project Report</h3>
            <div className="d-flex gap-3">
             <Link  to={`/chat/${project.fileId}`}className="btn btn-primary">
                <AutoAwesomeIcon/>Chat with pdf
                </Link>
              <a href={project.pdf} target="blank" download className="btn btn-success">
                Download PDF
              </a>
            </div>

            <h3 className="mt-4">Team Members</h3>
            <div className="list-group">
              {project.no1 && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  No 1: {project.no1}
                  <span className="badge bg-primary rounded-pill">Member</span>
                </li>
              )}
              {project.no2 && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  No 2: {project.no2}
                  <span className="badge bg-primary rounded-pill">Member</span>
                </li>
              )}
              {project.no3 && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  No 3: {project.no3}
                  <span className="badge bg-primary rounded-pill">Member</span>
                </li>
              )}
              {project.no4 && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  No 4: {project.no4}
                  <span className="badge bg-primary rounded-pill">Member</span>
                </li>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;
