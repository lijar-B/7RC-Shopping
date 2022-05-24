import React from 'react'
import logo from './img/logo.jpg'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img className="img" src={logo} alt="" />
        <h3>7CR SHopping</h3>
      </div>
    </div>
  )
}

export default Navbar
