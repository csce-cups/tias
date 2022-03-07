import React from 'react';
import './../Components/common.scss';
import rick from '../assets/rick.jpg'
import red from '../assets/red.png'
import green from '../assets/green.png'

export const Profile = () => {
  return (
    <div className="Profile hstack">
      <div className="vstack" style={{width :"20vw"}}>
        <div className="peer-teacher-heading">
          Peer Teacher
        </div>
          <img src={rick} className="profile-picture"/>
          <div className="name">
            Rick Astley
          </div>
      </div>
      <div className="vstack main">
        <div className="hstack"> 
          <button className="green button">Upload Schedule</button>
          <div className="render-container">
            <div className="left element">Last Updated: </div>
            <div className="fill element"/>
            <div className="element">Jan 1, 1970</div>
          </div>
        </div>
        <div className="vstack">
          <div className="header">
            Courses
          </div>
          <div className="class-render-container">
              CSCE 110
              <div className="fill element"/>
              <div className="element">
              <img src={green}></img>
              </div>
          </div>
          <div className="class-render-container">
              CSCE 121
              <div className="fill element"/>
              <div className="element">
              <img src={green}></img>
              </div>
          </div>          
          <div className="class-render-container">
              CSCE 221
              <div className="fill element"/>
              <div className="element">
              <img src={green}></img>
              </div>
          </div>          
          <div className="class-render-container">
              CSCE 222
              <div className="fill element"/>
              <div className="element">
              <img src={red}></img>
              </div>
          </div>
          <div className="class-render-container">
              CSCE 312
              <div className="fill element"/>
              <div className="element">
              <img src={green}></img>
              </div>
          </div>
          <div className="class-render-container">
              CSCE 314
              <div className="fill element"/>
              <div className="element">
              <img src={green}></img>
              </div>
          </div>          
          <div className="render-container">
              CSCE 313
              <div className="fill element"/>
              <div className="element">
              <img src={red}></img>
              </div>
          </div>          
          <div className="render-container">
              CSCE 411
              <div className="fill element"/>
              <div className="element">
              <img src={red}></img>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;