import React, { FC, useContext, useState } from 'react'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'
import contexts from '../APIContext'

interface Props {}

export const SchedulingWindow: FC<Props> = () => {
  const [blocks, _] = useContext(contexts.blocks);
  console.log(blocks);

  // const createFilter = () => {
  //   let cmap = object
  // }
  let filterMap = new Map([
    [110, true],
    [111, true],
    [120, true],
    [121, true],
    [206, true],
    [221, true],
    [222, true],
    [312, true],
    [314, true],
    [313, true],
    [315, true]
  ])
  const [filter, setFilter] = useState(filterMap);

  return (
    <div className="vstack main">
      < SchedulingRender filter={filter} />
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
