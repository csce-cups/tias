import React from 'react'
import rick from '../assets/rick2.jpg.png'
import './../Components/common.scss';

export const Landing = () => {
  return (
    <div className="app-body vstack background-image">
      <div className="landing-container">
        <button className="maroon button2">Start Scheduling</button>
      </div>
    </div>
  );
}

export default Landing;