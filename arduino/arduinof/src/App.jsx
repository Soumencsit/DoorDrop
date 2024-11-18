import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [status, setStatus] = useState('off'); // Track current status of LED and Buzzer

    // Function to handle the control of light and buzzer
    const handleLightControl = (state) => {
        axios
            .post('http://localhost:5000/api/light', { state })
            .then(response => {
                setStatus(state); // Update status based on the response
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Arduino Light & Buzzer Control</h1>
            <p>Current Status: {status === 'on' ? 'LED & Buzzer are ON' : 'LED & Buzzer are OFF'}</p>
            <button
                onClick={() => handleLightControl('on')}
                style={{
                    margin: '10px', 
                    padding: '10px', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    fontSize: '16px', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Turn On
            </button>
            <button
                onClick={() => handleLightControl('off')}
                style={{
                    margin: '10px', 
                    padding: '10px', 
                    backgroundColor: '#f44336', 
                    color: 'white', 
                    fontSize: '16px', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Turn Off
            </button>
        </div>
    );
};

export default App;
