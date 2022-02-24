import React, { FC } from 'react'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'

interface Props {
    
}

export const SchedulingWindow: FC<Props> = () => {
  return (
    <div className="column main">
      < SchedulingHeader />
      < SchedulingRender />
      < SchedulingFilter />
    </div>
  )
}
