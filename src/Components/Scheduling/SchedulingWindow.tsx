import React, { FC, useState } from 'react'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'

interface Props {
  
}

export const SchedulingWindow: FC<Props> = () => {
  const [filter, setFilter] = useState({
    110: true,
    111: true,
    120: true,
    121: true,
    206: true,
    221: true,
    222: true,
    312: true,
    314: true,
    313: true,
    315: true
  });

  return (
    <div className="vstack main">
      < SchedulingHeader />
      < SchedulingRender filter={filter} />
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
