import React from 'react'
import { ProfileFormRow } from './ProfileFormRow'

export const ProfileForm = () => {
  return (
    <div className="vstack render-container"style={{margin : "5px"}} >
    <div className="header">
      Courses
    </div>
    <ProfileFormRow element="CSCE 110" color="green"/>
    <ProfileFormRow element="CSCE 121" color="green"/>
    <ProfileFormRow element="CSCE 221" color="green"/>
    <ProfileFormRow element="CSCE 222" color="green"/>
    <ProfileFormRow element="CSCE 312" color="red"/>
    <ProfileFormRow element="CSCE 314" color="red"/>
    <ProfileFormRow element="CSCE 313" color="red"/>
    <ProfileFormRow element="CSCE 315" color="red"/>
    <ProfileFormRow element="CSCE 411" color="red"/>
    <div className="hstack" style={{margin : "15px"}}>
      <div className="element">
        Preferred Number of Lab Sections:&nbsp;&nbsp;  
      </div>
      <div className="dropdown">
      <button className="dropbtn">&#9660;</button>
      <div className="dropdown-content">
        <a href="#">4</a>
        <a href="#">3</a>
        <a href="#">2</a>
        <a href="#">1</a>
      </div>
    </div>
      <div className="element right">
        <button className="green button">Save Qualifications</button>
      </div>
    </div>
  </div>
  )
}
