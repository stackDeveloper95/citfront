import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  return (
    <footer className="pt-4 bg-dark text-white  text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>Learn more about our institute and our mission to provide quality education and innovative solutions.</p>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: ________________</p>
            <p>Phone: +91 9597134654</p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <a href="#" className="text-white mr-2"><FacebookIcon color= '#1877F2'/></a>
            <a href="#" className="text-white mr-2"><TwitterIcon/></a>
            <a href="#" className="text-white"><LinkedInIcon/></a>
            <a href="#" className="text-white"><InstagramIcon/></a>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <p>&copy; 2025 Our Institute. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
