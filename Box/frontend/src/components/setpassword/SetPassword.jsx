import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Storecontext } from '../../context/LoginContext'; 
import './SetPassword.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Setpassword() {
    const { userEmail } = useContext(Storecontext);
    const navigate = useNavigate();
    const [password, setpassword] = useState('');
    const { setUserEmail, setBoxId,setLogin ,boxId} = useContext(Storecontext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('boxId:', boxId, 'password:', password); // Logs boxId and password
    
        const payload = { boxId, password };
      
    
        try {
            const response = await axios.post(
                'https://doordropbackend.onrender.com/api/box/setpassword',
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );
      
    
            if (response.status === 200) {
                toast.success('Password set successfully!');
                navigate('/');
            } else {
                console.error('Failed response:', response);
                toast.error('Failed to set password. Please try again.');
            }
        } catch (error) {
            console.error('Error occurred:', error);
            if (error.response) {
                toast.error('Error response:', error.response.data);
            }
            toast.error('An error occurred. Please try again later.');
        }
    };
    

    return (
        <div className="Setpassword-container">
        <ToastContainer/>
            <div className="Setpassword-box">
                <h2>Set Your password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                        <label>password</label>
                    </div>
                    <button type="submit" className="Setpassword-button">
                        Set password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Setpassword;
