import React from 'react'
import rick from '../assets/rick2.jpg.png'
import './../Components/common.scss';
/*<img id="landing" src={rick} alt=''/>*/

export const Landing = () => {
  return (
    <div className="background-image">
      <div className="app-container vstack">
        <div className="landing-container2">
          <button className="maroon button2">Start Scheduling</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;