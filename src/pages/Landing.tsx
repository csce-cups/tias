import React, { useContext } from 'react'
import './../Components/common.scss';
import contexts from '../Components/APIContext';
import { Link } from 'react-router-dom';
import { GoogleButton } from '../Components/Misc/GoogleButton';
import bg from '../assets/landing.png'

export const Landing = () => {
  const user = useContext(contexts.user);
  return (
    <div className="app-body vstack background-image">
      <img src={bg} alt="background" className="background-image" />
      <div className="landing-container">
        {user.user?.administrator ? 
          <Link to='Scheduling' className="landing-button" style={{"textDecoration": "none"}}>
            Start Scheduling
          </Link>
        : user.user?.peer_teacher ? 
          <Link to='Profile' className="landing-button" style={{"textDecoration": "none"}}>
            View Profile
          </Link>
        : < GoogleButton renderAs={
            <a className="landing-button" style={{"textDecoration": "none"}}>Sign in with Google</a>
          }/>}
      </div>
    </div>
  );
}

export default Landing;