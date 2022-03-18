import React, { FC, useState } from 'react'
import { Store } from 'state-pool'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'

interface Props {
  APIData: Store
}

export const SchedulingWindow: FC<Props> = ({APIData}) => {
  const [filter, setFilter] = useState({
    121: true,
    221: true,
    312: true,
    314: true,
    313: true,
    315: true
  });

  return (
    <div className="vstack main">
      < SchedulingHeader />
      < SchedulingRender APIData={APIData} filter={filter} />
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
