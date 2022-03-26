import React from 'react'

export const ProfileStatusBar = () => {
  return (
    <div className="hstack"> 
      <button className="green button">Upload Schedule</button>
      <div className="render-container"  style={{margin : "5px"}}>
        <div className="left element">Last Updated: </div>
        <div className="fill element"/>
        <div className="element"style={{margin : "5px"}}>Jan 1, 1970</div>
      </div>
    </div>
  )
}
