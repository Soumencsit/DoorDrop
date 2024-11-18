import React from 'react'
import PinGenerate from './components/pingenerator/PinGenerate'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css'
function App() {
  return (
    <BrowserRouter>

<Routes>
  <Route path='/' element={<h1>Go to Correct Path</h1>}/>
  <Route path='/pin/:boxId/:uEmail/:dEmail' element={<PinGenerate />} />

</Routes>
  
      
    </BrowserRouter>
  )
}

export default App
