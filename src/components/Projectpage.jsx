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
    <div id="pro" className="page-shell">
      <header className="projects-hero glass">
        <div className="pill">Project Library</div>
        <div className="projects-head">
          <h1 className="section-title">Curated student builds, ready to explore.</h1>
          <p className="section-subtitle">Search across departments, filter by type, and open a profile to chat with any PDF.</p>
        </div>

        <div className="filter-bar">
          <div className="filter">
            <label>Project name</label>
            <input
              type="text"
              placeholder="E.g. Vision AI Lab"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="filter">
            <label>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Any</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button className="primary-btn filter-cta" onClick={handleSearch}>Run search</button>
        </div>
      </header>

      <div className="project-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card glass">
            <div className="project-media" style={{ backgroundImage: `url(${project.images})` }} />
            <div className="project-body">
              <div className="project-meta">
                <span className="chip">{project.department}</span>
                <span className="chip ghost">{project.type}</span>
              </div>
              <h4>{project.projectName}</h4>
              <p className="project-desc">{project.desc || 'A tightly scoped student project.'}</p>
              <div className="project-actions">
                <Link className="ghost-btn" to={`/profile/${project.fileId}`}>Open profile</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectPage;