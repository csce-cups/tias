import React from 'react'
import rick from '../../assets/rick.jpg'

export const ProfileSidebar = () => {
  return (
    <div className="profile-sidebar">
      <div style={{height: '100px'}}/>
      <span>Peer Teacher</span>
      <div className="hstack">
        <img src={rick} className="profile-picture"/>
      </div>
      <span>Rick Astley</span>

      <div className="fill"/>
      <span style={{padding: '20px'}}>Some Preferences Go Here</span>
    </div>
  )
}
