import React from 'react'
import './../Components/common.scss';

export const Tutorial = () => {
  return (
    <div className="app-body vstack">
        <div className="landing-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
        </div>
    </div>
  );
}

export default Tutorial;