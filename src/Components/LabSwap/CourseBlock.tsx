import { FormControl, InputLabel, Menu, MenuItem, Select } from '@material-ui/core'
import React, { FC, useState } from 'react'
import "../common.scss"
interface CourseInstance { // Results of a join between course, course_section, and section_meetings
  course: number,   // Course_Number from Course
  section: number,  // Section_Number from Course_Section
  start: Date,      // Start_Time from Section_Meeting
  end: Date         // End_Time from Section_Meeting 
  sections: Array<number>
  // If the API returns more information from this I can add them to the interface here
}
const colors = new Map()
colors.set(121, '#0086B6');
colors.set(221, '#434F6F');
colors.set(312, 'white');
colors.set(313, '#405AB9');
colors.set(314, 'white');
colors.set(315, '#009489');
interface Props {
  course_instance: CourseInstance,
  visible: boolean,
  select: any
}
export const CourseBlock: FC<Props> = ({course_instance, visible, select}) => {
  //need onclick to store selection in parent class
  const [section, setSection] = useState<String>("")
  const isVisible = {
    width: visible? undefined : 0,
    flex: visible? undefined : '0 0 auto',
    margin: visible? undefined : 0
  }

  const isContentVisible = {
    ...isVisible,
    display: visible? undefined : 'none'
  }
  const isFill = {
    width: visible? undefined : 0,
    flex: visible? "auto" : '0 0 auto',
    margin: visible? undefined : 0,
    display: visible? undefined : 'none'
  }
  const [open, setOpen]=useState(false);
  return (
    <FormControl className="block" title={`${course_instance.course}-${course_instance.section}`} 
    style={{backgroundColor: colors.get(course_instance.course), ...isVisible}}
    onClick={()=>setOpen(!open)}
    >
      <InputLabel id={`${course_instance.course}${course_instance.start}${course_instance.end}`} style={{alignContent:"center", ...isContentVisible}}>{course_instance.course}</InputLabel>
      <Select 
        labelId={`${course_instance.course}${course_instance.start}${course_instance.end}`} value={section}  
        onChange={(v)=>{select(course_instance,v.target.value);setSection(""+v.target.value)}}
        // style={{display: (open || section!==''? undefined:"none")}}
        open={open}
      >
        <MenuItem value="" ><em>None</em></MenuItem>
        {course_instance.sections.map((v,i)=><MenuItem value={v} key={i}>{v}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

