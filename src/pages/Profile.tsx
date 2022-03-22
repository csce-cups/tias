import React from 'react';
import './../Components/common.scss';
import rick from '../assets/rick.jpg'
import red from '../assets/red.png'
import green from '../assets/green.png'
import { GradeSelectorRow } from '../Components/Profile/GradeSelectorRow';

export const Profile = () => {
  return (
    <div className="Profile hstack">
      <div className="vstack" style={{width :"20vw"}}>
        <div className="name2">
          Peer Teacher
        </div>
        <div className="hstack">
          <img src={rick} className="profile-picture"/>
        </div>
        <div className="name">
          Rick Astley
        </div>
      </div>
      <div className="vstack main">
        <div className="hstack"> 
          <button className="green button">Upload Schedule</button>
          <div className="render-container"  style={{margin : "5px"}}>
            <div className="left element">Last Updated: </div>
            <div className="fill element"/>
            <div className="element"style={{margin : "5px"}}>Jan 1, 1970</div>
          </div>
        </div>
        <div className="vstack render-container"style={{margin : "5px"}} >
          <div className="header">
            Courses
          </div>
          <GradeSelectorRow element="CSCE 110" color="green"/>
          <GradeSelectorRow element="CSCE 121" color="green"/>
          <GradeSelectorRow element="CSCE 221" color="green"/>
          <GradeSelectorRow element="CSCE 222" color="green"/>
          <GradeSelectorRow element="CSCE 312" color="red"/>
          <GradeSelectorRow element="CSCE 314" color="red"/>
          <GradeSelectorRow element="CSCE 313" color="red"/>
          <GradeSelectorRow element="CSCE 315" color="red"/>
          <GradeSelectorRow element="CSCE 411" color="red"/>
          <div className="hstack" style={{margin : "15px"}}>
            <div className="element right">
              <button className="green button">Save Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;