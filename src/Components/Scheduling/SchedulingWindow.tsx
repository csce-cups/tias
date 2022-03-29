import React, { FC, useContext, useEffect, useState } from 'react'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'
import contexts from '../APIContext'
import { APICourseBlock, APICourseBlockWeek } from '../../modules/API'

interface Props {
  blocktype?: React.ElementType // What type of block to render
}

export const SchedulingWindow: FC<Props> = () => {
  const [blocks, _] = useContext(contexts.blocks);
  const [filter, setFilter] = useState(new Map<number, boolean>());
  
  useEffect(() => {
    let filterMap = new Map<number, boolean>();
    const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday];
    console.log(allBlocks)
    allBlocks.forEach((blocks: APICourseBlock[] | null) => {
      blocks?.forEach((block: APICourseBlock) => {
        filterMap.set(block.course_number, true)
      })
    })
    setFilter(filterMap);
  }, [blocks]);

  return (
    <div className="vstack main">
      < SchedulingRender filter={filter} />
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
