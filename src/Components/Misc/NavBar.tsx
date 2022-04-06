import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import contexts from '../APIContext';
import { GoogleButton } from "./GoogleButton";

export const NavBar = () => {
  const {doShowScheduling, doShowProfile, doShowLabSwap} = useContext(contexts.user);

  return (
    <div className="navbar">
      <Link to='/' className="left element major" style={{textDecoration: 'none'}}>TIAS</Link>
      {doShowScheduling && <Link to='Scheduling' className="left element">Scheduling</Link>}
      {doShowProfile && <Link to='Profile' className="left element">Profile</Link>}
      {doShowLabSwap && <Link to='Labswap' className="left element">LabSwap™</Link>}
      <div className="fill element"></div>
      < GoogleButton />
    </div>
  )
}

