import React, { FC } from 'react'

interface Props {
    width: string
}

export const ScheduleWindow: FC<Props> = ({width}) => {
  return (
    <div className="column" style={{width: width}}>
      ScheduleStack
    </div>
  )
}
