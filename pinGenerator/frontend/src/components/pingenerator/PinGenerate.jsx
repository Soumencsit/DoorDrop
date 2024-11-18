

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PinGenerate.css'; // Import the CSS file
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PinGenerate = () => {
  const { boxId, uEmail, dEmail } = useParams(); // Retrieve parameters from URL
  const [generatedPin, setGeneratedPin] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  const generateAndSendPin = async () => {
    const pin = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit PIN
    setGeneratedPin(pin);
    setLoading(true); // Start loading animation

    try {
      // Call API to store PIN in the backend
      const response = await axios.post('https://doordropbackend.onrender.com/api/box/temporarypassword', {
        boxId: boxId,
        tempPassword: pin, // Pass the generated PIN
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the PIN was successfully stored
      if (response.status === 200) {
        setStatusMessage('PIN stored successfully.');

        // Only send the notification if PIN was saved successfully
        await axios.post('https://pingeneratebackend.onrender.com/api/user/sendmessage', {
          userEmail: uEmail,
          deliverypersonemail: dEmail,
          pin: pin,
          boxId: boxId,
        });

        // Success message after sending the notification
        toast.success('PIN stored and notification sent successfully.');
        setStatusMessage('PIN stored and notification sent successfully.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to store PIN or send notification.');
      setStatusMessage('Failed to store PIN or send notification.');
    } finally {
      setLoading(false); // End loading animation
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="card">
        <h1>Delivery Confirmation</h1>
        <p>Box ID: <strong>{boxId.slice(-6,boxId.length)}</strong></p>
        <p>Delivery Person Email: <strong>{dEmail}</strong></p>
        {generatedPin && (
          <div className="pin-box">
            {generatedPin}
          </div>
        )}

        <button className="generate-btn" onClick={generateAndSendPin} disabled={loading}>
          {loading ? 'Sending...' : 'Generate PIN'}
        </button>

        {loading && <div className="loading-spinner"></div>} {/* Loading animation */}
        
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default PinGenerate;
