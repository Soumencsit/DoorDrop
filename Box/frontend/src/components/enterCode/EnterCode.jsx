import React, { useState, useContext, useRef } from "react";
import "./EnterCode.css";
import { Player } from '@lottiefiles/react-lottie-player'; 
import animationData from '../../assets/Animation - 1731764087298.json';
import axios from "axios"; // Import axios for backend communication
import { Storecontext } from '../../context/LoginContext'; // Import your context
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import lock from '../../assets/lock.png'
function EnterCode() {
  const [code, setCode] = useState("");  // State for the entered code
  const [isBoxOpened, setIsBoxOpened] = useState(false);  // State to track if the box is opened
  const [loading, setLoading] = useState(false);  // For loading state
  const { boxId } = useContext(Storecontext);
  console.log(boxId);
  
  
  const audioRef = useRef(null);  

  // Function to handle the control of light and buzzer
  const handleLightControl = (state) => {
    axios
      .post('http://localhost:5001/api/light', { state })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleUnlock = async () => {
    if (!boxId) {
      alert("Box ID is missing!");  // Show alert if boxId is not available
      return;
    }

    setLoading(true);  // Set loading state to true while API call is in progress

    try {
      console.log("Sending request to backend...");  // Debugging log to see if request is being made

      // Send the code and boxId to the backend for validation
      const response = await axios.post("https://doordropbackend.onrender.com/api/box/unlockbox", { boxId, code });
      
      console.log("API Response:", response.data);  // Debugging: Check the API response

      if (response.data.success) {
        setIsBoxOpened(true);  // Open the box if the backend confirms success
        handleLightControl('on');  // Turn on the light and buzzer when code matches
        audioRef.current.play(); // Play the sound when the box opens successfully
      
      } else {
        toast.error("Incorrect Code");  // Show error if code doesn't match
      }
    } catch (error) {
      // console.error("Error validating code:", error);
      // toast.error("An error occurred while validating the code.");
    } finally {
      setLoading(false);  
    }
  };

  const handleClose = () => {
    setIsBoxOpened(false);  // Reset box state
    setCode("");  // Clear the input field
    handleLightControl('off');  // Turn off the light and buzzer when box is closed
    audioRef.current.play(); // Play the sound when the box is closed
  };

  return (
    <div className="container">
    <ToastContainer/>
      <div className="box">
        <h2>Enter Code</h2>
        <input
          type="text"
          placeholder="Enter code here"
          value={code}
          onChange={(e) => setCode(e.target.value)}  // Update code on change
        />
        <div className={`status ${isBoxOpened ? "open" : ""}`}>
          <div className="icon">
            {isBoxOpened ? (
              <Player
                autoplay
                loop={false}  // Set loop to false to make the animation play only once
                src={animationData}  // Animation data file
                style={{ height: '300px', width: '300px' }}  // Customize size
              />
            ) :(
             <img src={lock}
              alt="Locked Box"
              style={{ height: '300px', width: '400px' }}

             />
            )}
          </div>
          <p>{isBoxOpened ? "Box Opened" : "Box Closed"}</p>
        </div>
        <button onClick={isBoxOpened ? handleClose : handleUnlock} disabled={loading}>
          {loading ? "Checking..." : isBoxOpened ? "Close" : "Unlock"}
        </button>
      </div>

      {/* Audio for sound effect */}
      {/* <audio ref={audioRef} src="/path/to/your/success-sound.mp3" /> */}
    </div>
  );
}

export default EnterCode;
