import { FormControl, InputLabel, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx';
import React, { FC, useState, useContext } from 'react'
import { selectFunction } from './LabSwap';
import RenderBlockProps, { blockColors } from '../Scheduling/BlockBase';
import "../common.scss"
import { CompressedCourseBlock } from '../../modules/BlockManipulation';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CompressedCourseBlock
  }
}

type stringEvent = SelectChangeEvent<string>;
export const LabSwapBlock: FC<Props> = ({visible, size, inline, data}) => {
  const {course_instance} = data;
  
  //need onclick to store selection in parent class
  const select = useContext(selectFunction);
  const [section, setSection] = useState<String>("");
  const c = course_instance;
  const [title, setTitle] = useState<String>(`${c.course_number}`);
  const id = `input-${c.toString()}`;
  const [open, setOpen] = useState(false);

  //magic taken from https://medium.com/@david.zhao.blog/typescript-error-argument-of-type-unknown-is-not-assignable-to-parameter-of-type-or-6b89f429cf1e
  const update = (ev: stringEvent)  => {
    let sec: String = (typeof ev.target.value === 'string' ? ev.target.value : ''); 
    if (sec === '') {
      setTitle(`${c.course_number}`)
      setSection('');
    } else {
      setSection(sec);
      setTitle(`${c.course_number}-${sec}`)
      select(c, sec);
    }
  }

  let flex: string | undefined = '0 0 0';
  if (!visible && inline === true) flex = '0 0 auto';
  else if (size && visible && size === 'auto') flex = `1 1 auto`
  else if (size && visible) flex = `0 0 ${size}`
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

  return (
    <FormControl 
      className="block grow-h" 
      style={{
        backgroundColor: blockColors.get(c!.course_number),
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
        {course_instance.section_numbers.map((v, i) => <MenuItem value={v.toString()} key={i}>{v}</MenuItem>)}
      </Select>
    </FormControl>
  )
  // FIXME: Questionable Key (using the index) here?
}

