import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '../convex/_generated/api';
import { useQuery } from "convex/react";
import { Link } from 'react-router-dom';
import "./projectpage.css"

function ProjectPage() {
  const tasks = useQuery(api.project.get);
  const [projectName, setProjectName] = useState('');
  const [department, setDepartment] = useState('');
  const [projects, setProjects] = useState([]);

  // List of departments (replace this with actual departments from your data if needed)
  const departments = ["MECH", "CS", "IT"];

  useEffect(() => {
    if (tasks) {
      setProjects(tasks); // Set projects once tasks are available
    }
  }, [tasks]);

  const handleSearch = () => {
    const filteredProjects = tasks.filter(
      (project) =>
        project.projectName.toLowerCase().includes(projectName.toLowerCase()) &&
        project.department.toLowerCase().includes(department.toLowerCase())
    );
    setProjects(filteredProjects);
  };

  return (
    <div id="pro" className="pt-5 mt-2">
      <header className="my-4 d-flex flex-column justify-content-center align-items-center ">
        <h1 className="display-3">Project Portal</h1>
        <p className="lead">Search and explore projects from various departments.</p>
      </header>

      <div className="row mb-4 d-flex justify-content-center">
        <div className="col-6 col-md-4 pt-4 px-4">
          <input
            type="text"
            className="form-control"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-4 pt-4 px-4">
          <select
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-center">
          <button className="mt-3 col-md-2 btn btn-success" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="row p-5">
        {projects.map((project, index) => (
          <div id="mainProfile" className=" col-sm-6 col-md-4 col-lg-4 mb-4" key={index}>

            <div className="">
              <img
                src={project.images}
                alt={project.projectName}
                className="card-img-top"
                style={{
                  objectFit: "cover",
                  height: "250px",  // Fixed height for image
                  width: "100%",
                  borderRadius: "30px",
                  zIndex: "0"  // Full width of the card
                }}
              />
              <div id="profile" className="d-flex flex-column justify-content-center align-items-center border border-light 
              opacity-75" style={{
                  position: 'relative',
                  top: "-250px",
                  borderRadius: "30px",
                  zIndex: "1",
                  height: "250px",  // Fixed height for image
                  width: "100%",
                  userSelect: "none",
                  opacity: "2px",

                }} >
                <h4 className="card-title text-dark">{project.projectName}</h4>
                <p className="card-text text-dark">
                  <strong>Department:</strong> {project.department}
                </p>
                <p className="card-text text-dark">
                  <strong>Type:</strong> {project.type}
                </p>
                <Link className="btn btn-sm btn-outline-primary" to={`/profile/${project.fileId}`}>view profile</Link>
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}

export default ProjectPage;


{/* <div className="col-lg-4 col-md-6 mb-4" key={index}>
  <div className="card h-100">
    <img
      src={project.images}
      alt={project.projectName}
      className="card-img-top"
      style={{
        objectFit: "cover",
        height: "200px",  // Fixed height for image
        width: "100%",    // Full width of the card
      }}
    />
    <div className="card-body">
      <h4 className="card-title">{project.projectName}</h4>
      <p className="card-text">
        <strong>Department:</strong> {project.department}
      </p>
      <p className="card-text">
        <strong>Type:</strong> {project.type}
      </p>
      <Link className="btn btn-sm btn-outline-primary" to={`/profile/${project.fileId}`}>view profile</Link>
    </div>
  </div>
</div> */}