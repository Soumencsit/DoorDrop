import {React,useContext} from "react";


import Navbar from "./components/navbar/Navbar";
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import Home from  './pages/home/Home'
import LoginForm  from "./components/login/LoginForm";
import SetPassword from "./components/setpassword/SetPassword";
import { Storecontext } from './context/LoginContext';
import EnterCode from "./components/enterCode/EnterCode";
import QR from './pages/qr/QR'
import FaceAuthenTication from "./components/faceAuthentication/FaceAuthenTication";
export default function App() {

  const { isLogin } = useContext(Storecontext);
  return (

   

    <BrowserRouter>
    <Navbar/>
    <ToastContainer/>
  
   
    <div className="app-container">
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/login" element={<LoginForm/>}/>
      {isLogin?<Route path="/setuppassword" element={<SetPassword/>}/>:''}

      <Route path="/entercode" element={<EnterCode/>}/>
      <Route path="/faceauth" element={<FaceAuthenTication/>}/>
      <Route path="/qr" element={<QR/>}/>
      
    
   

     </Routes>

      
    </div>

    </BrowserRouter> 

 
  
  );
}
