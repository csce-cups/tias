import React from 'react'
import {Link} from "react-router-dom";

export const NavBar = () => {
  return (
    <div className="navbar">
        <div className="left element major">TIAS</div>
        <Link className="left element" to='/Profile'>Profile</Link>
        <Link className="left element" to='Scheduling'>Scheduling</Link>
        <div className="left element">LabSwap™</div>
        <div className="fill element"></div>
        <div className="element"><u>Sign Out</u></div>
    </div>
  )
}
