// src/HomePage.js
import React from 'react';
import './Home.css'; // Import the updated CSS file
import img from '../../assets/boximg.png'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate=useNavigate()
  const enterCode=()=>{
    navigate('/faceauth')
    //!============================================
    // navigate('/entercode')
  }

  return (
    <div className="home-page">
      <div className="delivery-box-wrapper">
        {/* Image of the delivery box */}
        <img
          src={img}
          alt="Delivery Box"
          className="delivery-box-image"
        />
      </div>
      <button className="open-camera-btn" onClick={()=>enterCode()}>Enter PIN</button>
    </div>
  );
};

export default HomePage;

