import React from 'react';
import './../Components/common.scss';

export const Profile = () => {
  return (
    <div className="Profile hstack">
      <div className="vstack" style={{width :"20vw"}}>
        <div className="scrollable">side bar </div>
      </div>
      <div className="vstack main">
        <div className="hstack"> 
          <button className="green button">Upload Schedule</button>
          <div className="left element">Last Updated: </div>
          <div className="fill element"/>
          <div className="element">Jan 1, 1970</div>
        </div>
        <div className="vstack">
          <div className="header">
            Courses
          </div>
          <div className="render-container">
              CSCE 110
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;