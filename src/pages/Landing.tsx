import React, { useContext } from 'react'
import './../Components/common.scss';
import contexts from '../Components/APIContext';
import { Link } from 'react-router-dom';
import { GoogleButton } from '../Components/Misc/GoogleButton';

export const Landing = () => {
  const user = useContext(contexts.user);
  return (
    <div className="app-body vstack background-image">
      <div className="landing-container">
        {user.user?.administrator ? <Link to='Scheduling' className="maroon button2" style={{"textDecoration": "none"}}>Start Scheduling</Link>
        : user.user?.peer_teacher ? <Link to='Profile' className="maroon button2" style={{"textDecoration": "none"}}>View Profile</Link>
        : < GoogleButton />}
      </div>
    </div>
  );
}

export default Landing;