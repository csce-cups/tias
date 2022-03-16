import React, { FC, SetStateAction, useState } from 'react'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'

interface Props {
    setRequests: SetStateAction<any>,
    setOffers:  SetStateAction<any>
}

export const SchedulingWindow: FC<Props> = ({setRequests, setOffers}) => {
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
      < SchedulingRender filter={filter} setRequests={setRequests} setOffers={setOffers}/>
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
