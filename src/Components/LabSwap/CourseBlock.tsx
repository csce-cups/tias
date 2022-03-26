import { FormControl, InputLabel, Menu, MenuItem, Select } from '@material-ui/core'
import React, { FC, useState } from 'react'
import SelectUnstyled from '@mui/base/SelectUnstyled';
import uuid from '../../uuid'
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
type stringEvent = React.ChangeEvent<{ name?: string, value: unknown}>;
export const CourseBlock: FC<Props> = ({course_instance, visible, select}) => {
  //need onclick to store selection in parent class
  const [section, setSection] = useState<String>("")
  const c = course_instance;
  const [title ,setTitle] = useState<String>(`${c.course}`)
  const id = `input-${c.toString()}`
  const [open, setOpen]=useState(false);
  const update = (ev: stringEvent)  => {
    //magic taken from https://medium.com/@david.zhao.blog/typescript-error-argument-of-type-unknown-is-not-assignable-to-parameter-of-type-or-6b89f429cf1e
    let sec: String = (typeof ev.target.value === 'string' ? ev.target.value : ''); 
    setSection(sec);
    setTitle(`${c.course}-${sec}`)
    select(c,sec);
  }
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
  return (
    <FormControl className="block" style={{backgroundColor: colors.get(c.course), ...isVisible}} onClick={()=>setOpen(!open)}>
      <InputLabel id={id}>{title}</InputLabel>
      <Select 
        value={''}  
        onChange={update}
        // className="block" style={{backgroundColor: colors.get(c.course), ...isVisible}}
        style={{display: (open ? undefined:"none")}}
        open={open}
      >
        <MenuItem value="" ><em>None</em></MenuItem>
        {course_instance.sections.map((v,i)=><MenuItem value={v.toString()} key={i}>{v}</MenuItem>)}
      
      </Select>
    </FormControl>
  )
}

