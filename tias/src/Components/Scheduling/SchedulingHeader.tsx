import React from 'react'
import popcorn1 from '../../assets/Popcorn_1.png'

export const SchedulingHeader = () => {
  return (
	  <div className="row">
		  <h2 className="slim element">Current Schedule:</h2>
      <h2 className="slim element right">
        <img src={popcorn1} alt="do this later" className="element right"/>
        98
      </h2>
    </div>
  )
}
