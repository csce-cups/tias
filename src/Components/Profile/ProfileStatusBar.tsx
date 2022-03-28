import React from 'react'

export const ProfileStatusBar = () => {
  return (
    <div className="profile-status-bar"> 
      <button className="blue button">Upload Schedule</button>
      <div className="profile-status">
        <div className="left element">Last Updated: </div>
        <div className="fill element"/>
        <div className="element" style={{marginRight: '5px'}}>Jan 1, 1970</div>
      </div>
    </div>
  )
}
