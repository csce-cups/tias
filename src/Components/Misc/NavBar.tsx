import React from 'react'
import {Link} from "react-router-dom";
import { GoogleButton } from "./GoogleButton"

export const NavBar = () => {
  return (
    <div className="navbar">
        <div className="left element major">TIAS</div>
        <Link className="left element" to='/Profile'>Profile</Link>
        <Link className="left element" to='Scheduling'>Scheduling</Link>
        <div className="left element">LabSwap™</div>
        <div className="fill element"></div>
        < GoogleButton />
    </div>
  )
}

