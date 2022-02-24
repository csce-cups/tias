import React, { FC } from 'react'

interface Props {
    
}

export const ScheduleWindow: FC<Props> = () => {
  return (
    <div className="column main">
      <div className="row">
        ScheduleLabel
      </div>
      <div className="row">
        ScheduleFilter
      </div>
      <div className="row">
        ScheduleRender
      </div>
    </div>
  )
}
