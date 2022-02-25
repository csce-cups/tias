import React from 'react'

export const SchedulingRender = () => {
  let grid = [];
  for (let i = 0; i < 5*11; i++) {
    grid.push(<div></div>)
  }

  return (
    <>
      <div className="render-grid slim">
        {grid}
      </div>
    </>
  )
}
