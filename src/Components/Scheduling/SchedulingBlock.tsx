import React, { FC } from 'react'
import { Dot } from '../Misc/Dot'

const colors = new Map()
colors.set(121, '#0086B6');
colors.set(221, '#434F6F');
colors.set(312, 'white');
colors.set(313, '#405AB9');
colors.set(314, 'white');
colors.set(315, '#009489');

interface CourseInstance { // Results of a join between course, course_section, and section_meetings
  course: number,   // Course_Number from Course
  section: number,  // Section_Number from Course_Section
  start: Date,      // Start_Time from Section_Meeting
  end: Date         // End_Time from Section_Meeting 
  // If the API returns more information from this I can add them to the interface here
}

interface Props {
  course_instance: CourseInstance,
  visible: boolean
}

export const SchedulingBlock: FC<Props> = ({course_instance, visible}) => {
  const isVisible = {
    width: visible? undefined : 0,
    flex: visible? undefined : '0 0 auto',
    margin: visible? undefined : 0
  }

  const isContentVisible = {
    ...isVisible,
    display: visible? undefined : 'none'
  }

  return (
    <div className="block" 
      title={`${course_instance.course}-${course_instance.section}`} 
      style={{backgroundColor: colors.get(course_instance.course), ...isVisible}}
    >
      <div className="block-indicator slim" style={isContentVisible}>
        < Dot linkID={Math.floor(Math.random()*20)}/> {/* TODO: Random Keys to be replaced }*/}
      </div>
      <div className="block-text" style={isContentVisible}>
        {course_instance.course}-{course_instance.section}
      </div>
    </div>
  )
}
