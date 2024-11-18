import React from 'react'
import img from '../../assets/QR.jpg'
import './QR.css'
function QR() {
  return (
    <div className='qr-container'>
      <img src={img} alt='qr-page'/>
    </div>
  )
}

export default QR
