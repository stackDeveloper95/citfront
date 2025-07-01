import React from "react";
import "./profilepage.css";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link } from "react-router-dom";



const ProfilePage = ({ projects }) => {

  return (
    <div
      className="d-flex gap-3 justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "2rem" }}

    >
      <div className="d-flex gap-2 flex-column " style={{ minHeight: "50vh", padding: "2rem" }} >
        {projects.map((project, index) => (<div className="">

          <div className="bg-white rounded shadow-sm d-flex gap-2 flex-row justify-content-start align-items-center p-3 mb-3">
            <h2 className="h6 mb-0 me-2 text-secondary">Type:</h2>
            <span className="text-primary">{project.type}</span>
          </div>


          <div
            key={index}
            className="bg-white shadow-sm rounded-4 p-4 mb-5 "
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
          >
            {/* Header with Image and Email */}
            <div className="d-flex align-items-center mb-4">
              <img
                src={project.images}
                alt="Profile"
                style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  marginRight: "1rem",
                }}
              />
            </div>

          </div>
        </div>))}

      </div>
      <div className="w-100" style={{ maxWidth: "700px" }}>
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-4 p-4 mb-5"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)", height: "450px" }}
          >
            {/* Header with Image and Email */}
            <div className="d-flex align-items-center mb-4">
              <img
                src={project.images}
                alt="Profile"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "1rem",
                }}
              />
              <div>
                <h5 className="mb-0 text-dark">{project.projectName}</h5>
                <p className="text-muted mb-0 text-dark">{project.
                  desc
                  || "there is no desc"}</p>
              </div>
            </div>

            {/*            
            <div className="mb-4">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Name</span>
                <span className="text-muted">{project.projectName}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Email account</span>
                <span className="text-muted">{project.email || "yourname@gmail.com"}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Mobile number</span>
                <span className="text-muted">{project.mobile || "Add number"}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Location</span>
                <span className="text-muted">{project.location || "USA"}</span>
              </div>
            </div>

           
            <div className="text-end">
              <button className="btn btn-primary">Save Change</button>
            </div> */}

            {/* Chat and PDF Download Section */}
            <div className="d-flex flex-wrap gap-3 mt-4">
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

              <p className="text-dark mb-0 text-dark">View the PDF, and ask the AI if you have any questions  <AutoAwesomeIcon /></p>
            </div>



            {/* Team Members Section */}
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
  );
};

export default ProfilePage;

