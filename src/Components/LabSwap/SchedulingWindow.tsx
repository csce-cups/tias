import React, { FC, SetStateAction, useState } from 'react'
import { SchedulingHeader } from './SchedulingHeader'
import { SchedulingRender } from './SchedulingRender'
import { SchedulingFilter } from './SchedulingFilter'
interface CourseInstance { // Results of a join between course, course_section, and section_meetings
  course: number,   // Course_Number from Course
  section: number,  // Section_Number from Course_Section
  start: Date,      // Start_Time from Section_Meeting
  end: Date         // End_Time from Section_Meeting 
  sections: Array<number>
  // If the API returns more information from this I can add them to the interface here
}
interface Props {
  select: any
}

export const SchedulingWindow: FC<Props> = ({select}) => {
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
      < SchedulingRender filter={filter} select={select}/>
      < SchedulingFilter filter={filter} setFilter={setFilter}/>
    </div>
  )
}
