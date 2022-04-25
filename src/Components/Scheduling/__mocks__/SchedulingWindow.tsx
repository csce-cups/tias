import React, { FC, useContext } from 'react'
import { CompressedCourseBlock } from '../../../modules/BlockFunctions'
import { selectedTradeBlocksContext } from '../../LabSwap/LabSwap'
import RenderBlockProps from '../BlockBase'
import { OptionsProps } from '../SchedulingWindow'

interface Props {
  renderBlockType: React.FC<RenderBlockProps>
  top?: React.ReactNode
  options?: OptionsProps
}

const offer1:CompressedCourseBlock = {
  section_numbers: ["500"],
  professors: ["Leyk"],
  section_ids: [0],
  locations: ["Zach"],
  scheduledAll: [[1]],
  department: 'CSCE',
  course_number: 102,
  section_number: '500',
  section_id: 0,
  start_time: null,
  end_time: null,
  weekday: 'W',
  place: 'Zach',
  scheduled: [1],
  professor: 'Leyk',
  capacity_peer_teachers: 1
}
const request1:CompressedCourseBlock = {
  section_numbers: ["600"],
  professors: ["Thomas"],
  section_ids: [10],
  locations: ["EABA"],
  scheduledAll: [[11]],
  department: 'CSCE',
  course_number: 221,
  section_number: '600',
  section_id: 10,
  start_time: null,
  end_time: null,
  weekday: 'W',
  place: 'EABA',
  scheduled: [11],
  professor: 'Thomas',
  capacity_peer_teachers: 1
}
const request = {
  ...request1,
  section_number: request1.section_numbers[0],
      professor: request1.professors[0],
      section_id: request1.section_ids[0],
      scheduled: request1.scheduledAll[0]
}
const offer = {
  ...offer1,
  section_number: offer1.section_numbers[0],
      professor: offer1.professors[0],
      section_id: offer1.section_ids[0],
      scheduled: offer1.scheduledAll[0]
}
export const SchedulingWindow: FC<Props> = ({top}) => {
  const [selectedTradeBlocks, setSelectedTradeBlocks] = useContext(selectedTradeBlocksContext);
  return (
    <div data-testid="SchedulingWindow">
      <button data-testid="request" onClick={()=>{
        setSelectedTradeBlocks({offered: selectedTradeBlocks.offered, requested: request})
      }}/>
      <button data-testid="offer" onClick={()=>{
        setSelectedTradeBlocks({requested: selectedTradeBlocks.requested, offered: offer})
      }}/>
    </div>
  )
}
