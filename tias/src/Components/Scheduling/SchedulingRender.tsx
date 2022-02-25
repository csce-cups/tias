import React from 'react'
import { SchedulingColumn } from './SchedulingColumn';

export const SchedulingRender = () => {
  let grid = [];
  for (let i = 0; i < 5*11; i++) {
    grid.push(<div></div>)
  }

  return (
    <div className="render-container">
      <div className="render-content">
        < SchedulingColumn />
        < SchedulingColumn />
        < SchedulingColumn />
        < SchedulingColumn />
        < SchedulingColumn end={true} />
      </div>
    </div>
  )
}
