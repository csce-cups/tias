import React, { FC, useState } from 'react'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'

interface Props {
    
}

export const SchedulingWindow: FC<Props> = () => {
  const [filter, setFilter] = useState({
    121: true,
    221: true,
    312: true,
    314: true,
    313: true,
    315: true
  });
  const [dayFilter, setDayFilter] = useState(new Array(5).fill(true));
  // (filter[course.num] ? <course/> : null)
  const updateDays = (day: Number) => () =>{ //returns function used to give to div
    setDayFilter(dayFilter.map((v,i) => (day==i? v : !v))); //toggle all elements but the one clicked
  } 
  return (
    <div className="vstack main">
      < SchedulingHeader />
      < SchedulingRender filter={filter} dayFilter={dayFilter} update={updateDays}/>
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
