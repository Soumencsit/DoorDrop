import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StorecontextProvider from "./context/LoginContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <StorecontextProvider>
    <App />
  </StorecontextProvider>
  </StrictMode>,
)
