// src/LoginForm.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Storecontext } from '../../context/LoginContext';
import './LoginForm.css'; // Import the CSS file here
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUserEmail, setBoxId,setLogin ,boxId} = useContext(Storecontext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    const data = { email, password };

    try {
      const response = await axios.post('https://doordropbackend.onrender.com/api/box/login', data);
      
      

      if (response.data.success === true) {
        setUserEmail(email);
        setBoxId(response.data.userdata.boxId);
      
        
        setLogin(true)
        toast.success("Login successful!");
        navigate('/setuppassword');
       
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (err) {
      console.log(err);
      
      toast.err("Error connecting to the backend.");
    }
  };

  return (
    <div className="login-container">
    <ToastContainer/>
      <div className="login-box">
        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Please enter your details</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
       
          <button type="submit" className="submit-btn">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
