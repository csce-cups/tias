import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import contexts from '../APIContext';
import { GoogleButton } from "./GoogleButton";

export const NavBar = () => {
  const {doShowScheduling, doShowProfile, doShowLabSwap, doShowAdmin} = useContext(contexts.user);

  return (
    <div className="navbar">
      <Link to='/' className="left element major" style={{textDecoration: 'none'}}>TIAS</Link>
      {doShowScheduling && <Link to='scheduling' className="left element">Scheduling</Link>}
      {doShowAdmin &&      <Link to='admin' className="left element">Admin</Link>}
      {doShowProfile &&    <Link to='profile' className="left element">Profile</Link>}
      {doShowLabSwap &&    <Link to='labswap' className="left element">LabSwap™</Link>}
      <div className="fill element"></div>
      < GoogleButton />
    </div>
  )
}

