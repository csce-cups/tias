import React from 'react'
import { Link } from "react-router-dom";
import { parseCookie } from '../../modules/API';
import { GoogleButton } from "./GoogleButton"

export const NavBar = () => {
  return (
    <div className="navbar">
      <Link to='/' className="left element major" style={{textDecoration: 'none'}}>TIAS</Link>
      <Link to='Profile' className="left element">Profile</Link>
      <Link to='Scheduling' className="left element">Scheduling</Link>
      <div className="left element">LabSwap™</div>
      <div className="fill element"></div>
      < GoogleButton />
    </div>
  )
}

