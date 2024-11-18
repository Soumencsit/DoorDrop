import React, { useState,useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './Navbar.css'; // Import the CSS file
import logo from '../../assets/logo.png'
import { Storecontext } from '../../context/LoginContext';

import { useNavigate } from 'react-router-dom';
function Navbar() {
 
  const navigate=useNavigate()
  const { isLogin,setLogin } = useContext(Storecontext);
  
  const signinFun=()=>{
       navigate('/signup')  
  }
  
  return (
    <nav className="navbar">
      <div className="logo">
      <img src={logo}/>
        
      </div>
      <div className="nav-links">

        <ul className="nav-links">
        <li><NavLink to="/" ><button  className="download-button">Home</button></NavLink></li>
        </ul>

        <ul className="nav-links">
        <li><NavLink to="/qr" ><button className='download-button'>QR</button></NavLink></li>
        </ul>
      </div>
      <div className='navbar-right'>

        <NavLink to="/login">
        <button
         className="download-button"
         onClick={()=>{signinFun()}}
        >
        <strong>{isLogin ? "Logout" : "Login"}</strong>
        
        </button>
        </NavLink>
      </div>
    
    </nav>
  );
}

export default Navbar;
