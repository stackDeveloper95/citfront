import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/search'
import Inputform from '../components/inputform'
import "./home.css"

const Upload = () => {
  return (
   <div id='home'>
    <Navbar />  <div className="text-center">
   <div className="bg-dark row align-items-start">
     <div className="col-4 col-md-2">
       <Search />
     </div>
     <div className="col-8 col-md-10">
       <Inputform />
     </div>
   </div>
   </div>

   </div >
  )
}

export default Upload