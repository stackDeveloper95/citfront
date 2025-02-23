import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/search'
import ProjectPage from '../components/Projectpage'
import "./home.css"

const Project = () => {
  return (
    <>
    <div id="home">
    <Navbar />  <div className="text-center">
   <div className=" row align-items-start">
     <div className="col-4 col-md-2">
       <Search />
     </div>
     <div className="col-8 col-md-10">
      <ProjectPage/>
     </div>
   </div>
   </div>
   </div>

   </>
    
  )
}

export default Project;