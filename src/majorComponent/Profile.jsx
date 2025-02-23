import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import ProfilePage from '../components/profile';
import "./home.css"

const Profile = () => {
  const { id } = useParams();
  
  // Call the getByFileId query with fileId as a parameter
  const projects = useQuery(api.project.getByFileId, { fileId: id });

  return (
    <div id="home">
      <Navbar />
      {projects ? (
        <ProfilePage projects={projects} />
      ) : (
        <div className="loading-text">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;



