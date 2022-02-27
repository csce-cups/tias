import React, { FC } from 'react'

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
  course_instance: CourseInstance
}

const time_to_height = (start: Date, end: Date) => {
  const day = 12*60*60*1000; // Represents 100% of the view
  return (end.getTime() - start.getTime()) / day * 100;
}

export const SchedulingBlock: FC<Props> = ({course_instance}) => {
  return (
    <div className="block" style={{backgroundColor: colors.get(course_instance.course)}}>{course_instance.course}-{course_instance.section}</div>
  )
}
