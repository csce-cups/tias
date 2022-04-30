import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import uuid from '../../uuid';
import contexts from '../APIContext';
import { GoogleButton } from "./GoogleButton";
import { TutorialModal } from './TutorialModal';

export const NavBar = () => {
  const {doShowScheduling, doShowProfile, doShowLabSwap, doShowAdmin} = useContext(contexts.user);

  return (
    <div className="navbar">
      <Link to='/' className="left element major" style={{textDecoration: 'none'}}>TIAS</Link>
      {doShowScheduling && <Link to='scheduling' className="left element" style={{textDecoration: 'none'}}>Scheduling</Link>}
      {doShowAdmin &&      <Link to='admin' className="left element" style={{textDecoration: 'none'}}>Admin</Link>}
      {doShowProfile &&    <Link to='profile' className="left element" style={{textDecoration: 'none'}}>Profile</Link>}
      {doShowLabSwap &&    <Link to='labswap' className="left element" style={{textDecoration: 'none'}}>LabSwap™</Link>}
      <div className="fill element"/>
      < TutorialModal />
      < GoogleButton />
    </div>
  )
}

