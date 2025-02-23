import React from 'react'
import "../app.css"
import project from "../images/project.png"
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <div class="bg-light">
      <nav id="nav" class="w-100 navbar navbar-expand-lg bg-yellow-300">
        <div class="container-fluid">
          <div class="text-light">
            <a class="navbar-brand text-light " href="/">CIT</a>
            <img src={project} className='image' alt="do not" />
          </div>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 px-lg-5 ">
              <li class="nav-item ">
                <Link className='nav-link text-light' to="/">Home</Link>
              </li>
              <li class="nav-item">
                <Link className='nav-link text-light' to="/upload">Upload</Link>
              </li>
              <li class="nav-item">
                <Link className='nav-link text-light' to="/project">Project</Link>
              </li>
              {/* <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Dropdown
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
      </li> */}
            </ul>
            <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button class="btn btn-outline-dark" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar