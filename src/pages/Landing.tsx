import React, { useContext } from 'react'
import rick from '../assets/rick2.jpg.png'
import './../Components/common.scss';
import contexts from '../Components/APIContext';

export const Landing = () => {
  const user = useContext(contexts.user);
  let text = "Sign In";
  if(user.user?.administrator) {
    text = "Start Scheduling";
  } else if (user.user?.peer_teacher) {
    text = "View Profile";
  }
  return (
    <div className="app-body vstack background-image">
      <div className="landing-container">
        <button className="maroon button2">{text}</button>
      </div>
    </div>
  );
}

export default Landing;