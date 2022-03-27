import { FormControl, InputLabel, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx';
import React, { FC, useState, useContext } from 'react'
import { selectFunction } from './LabSwap';
import "../common.scss"
interface CourseInstance{
  department: string
	course_number: number
	section_numbers: Array<number>
	start_time: Date
	end_time: Date
	weekday: string
	place: string
}
const colors = new Map()
colors.set(121, '#713275');
colors.set(221, '#443989');
colors.set(222, '#4C698A');
colors.set(312, '#4F8970');
colors.set(313, '#2B6737');
colors.set(314, '#677D5D');
colors.set(315, '#394708');
interface Props {
  linkIDs?: number[],
  spacer?: boolean,
  size?: string,
  inline?: boolean,
  course_instance: CourseInstance,
  visible: boolean,
}
type stringEvent = SelectChangeEvent<string>;
export const CourseBlock: FC<Props> = ({course_instance, visible, spacer, size, inline}) => {
  //need onclick to store selection in parent class
  const select = useContext(selectFunction);
  const [section, setSection] = useState<String>("")
  const c = course_instance;
  const [title ,setTitle] = useState<String>(`${c.course_number}`)
  const id = `input-${c.toString()}`
  const [open, setOpen]=useState(false);
  const update = (ev: stringEvent)  => {
    //magic taken from https://medium.com/@david.zhao.blog/typescript-error-argument-of-type-unknown-is-not-assignable-to-parameter-of-type-or-6b89f429cf1e
    let sec: String = (typeof ev.target.value === 'string' ? ev.target.value : ''); 
    console.log("SEC: |"+sec+"|")
    if(sec === ''){
      setTitle(`${c.course_number}`)
      setSection('');
    }else{
      setSection(sec);
      setTitle(`${c.course_number}-${sec}`)
      select(c,sec);

    }
  }
  let flex: string | undefined = '0 0 0';
  if (!visible && inline === true) flex = '0 0 auto';
  else if (size && visible && size === 'auto') flex = `1 1 auto`
  else if (size && visible) flex = `0 0 ${size}`
  else if (visible && spacer) flex = '1 1 auto'
  else if (visible) flex = undefined

  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }

  const isContentVisible = {
    ...isVisible,
    display: visible? undefined : 'none'
  }
  const isOpen = {display: (open && visible ? undefined : 'none')};
  if (spacer === true) return <div className="block spacer" style={isVisible}/>

  return (
    <FormControl 
      className="block" 
      style={{
        backgroundColor: colors.get(c!.course_number),
        ...isVisible
      }} 
      onClick={()=>setOpen(!open)}
      sx={{height: "100%"}}
      
    >
      <InputLabel 
      id={id} 
      style={isContentVisible}
      sx={{textAlignLast: 'center', color:'white'}}
      >{title}</InputLabel>
      <Select
        labelId={id}
        value={''}  
        onChange={update}
        style={isOpen}
        open={open}
        sx={{height: "100%"}}
        IconComponent={()=>null}
      >
        <MenuItem value="" ><em>None</em></MenuItem>
        {course_instance.section_numbers.map((v,i)=><MenuItem value={v.toString()} key={i}>{v}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

