import React from 'react'
import rick from '../../assets/rick.jpg'

export const ProfileSidebar = () => {
  return (
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
  )
}
