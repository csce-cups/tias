import { SelectData, Selections } from './LabSwap';
import "../common.scss"

import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { APIUserPreferenceEnum } from '../../modules/API';
import { CompressedCourseBlock } from '../../modules/BlockManipulation';
import uuid from '../../uuid';
import contexts from '../APIContext';
import RenderBlockProps, { calcFlex, blockColors, statusColors } from '../Scheduling/BlockBase';

// type stringEvent = SelectChangeEvent<string>;
// export const LabSwapBlock: FC<Props> = ({visible, size, inline, data}) => {
//   const {course_instance, tradeBlocks} = data;
  
//   //need onclick to store selection in parent class
//   const select = useContext(SelectData);
//   const [section, setSection] = useState<String>("");
//   const c = course_instance;
//   const [title, setTitle] = useState<String>(`${c.course_number}`);
//   const id = `input-${c.toString()}`;
//   const [open, setOpen] = useState(false);

//   //magic taken from https://medium.com/@david.zhao.blog/typescript-error-argument-of-type-unknown-is-not-assignable-to-parameter-of-type-or-6b89f429cf1e
//   const update = (ev: stringEvent)  => {
//     let sec: String = (typeof ev.target.value === 'string' ? ev.target.value : ''); 
//     if (sec === '') {
//       setTitle(`${c.course_number}`)
//       setSection('');
//     } else {
//       setSection(sec);
//       setTitle(`${c.course_number}-${sec}`)
//     }
//   }

//   let flex: string | undefined = '0 0 0';
//   if (!visible && inline === true) flex = '0 0 auto';
//   else if (size && visible && size === 'auto') flex = `1 1 auto`
//   else if (size && visible) flex = `0 0 ${size}`
//   else if (visible) flex = undefined

//   const isVisible = {
//     width: (visible)? undefined : 0,
//     flex: flex,
//     margin: visible? undefined : 0
//   }

//   const isContentVisible = {
//     ...isVisible,
//     display: visible? undefined : 'none'
//   }

//   const isOpen = {display: (open && visible ? undefined : 'none')};

//   return (
//     <FormControl 
//       className="block grow-h" 
//       style={{
//         backgroundColor: blockColors.get(c!.course_number),
//         ...isVisible
//       }} 
//       onClick={()=>setOpen(!open)}
//       sx={{height: "100%"}}
//     >
//       <InputLabel 
//         id={id} 
//         style={isContentVisible}
//         sx={{textAlignLast: 'center', color:'white'}}
//       >{title}</InputLabel>
//       <Select
//         labelId={id}
//         value={''}  
//         onChange={update}
//         style={isOpen}
//         open={open}
//         sx={{height: "100%"}}
//         IconComponent={()=>null}
//       >
//         <MenuItem value="" ><em>None</em></MenuItem>
//         {course_instance.section_numbers.map((v, i) => <MenuItem value={v.toString()} key={i}>{v}</MenuItem>)}
//       </Select>
//     </FormControl>
//   )
//   // FIXME: Questionable Key (using the index) here?
// }



interface Props extends RenderBlockProps {
  data: {
    course_instance: CompressedCourseBlock
    linkIDs: number[] | null
  }
}

export const LabSwapBlock: FC<Props> = ({visible, size, inline, edge, bottom, data}) => {
  const [interacted, setInteracted] = useState<boolean>(false);
  const user = useContext(contexts.user);
  const {course_instance} = data;
  const isScheduled = (user.user && course_instance.scheduled?.includes(user.user.person_id));
  const ref: any = useRef(null);
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && interacted) {
        setInteracted(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const resName = (prof: string) => {
    if (prof !== "") {
      return `with ${prof} `;
    } else {
      return '';
    }
  }

  let formElements: JSX.Element[] = [];
  course_instance.section_ids.forEach((section_id, i) => {
    formElements.push(
      <div key={`pref-row-${JSON.stringify(course_instance)}-${section_id}`} className="pref-row nowrap">
        <input id={`pref-row-checkbox-${course_instance.course_number}-${section_id}`} type="radio" name={`course-checkbox-${course_instance.section_id}`} data-sid={section_id} />
        <label htmlFor={`pref-row-checkbox-${course_instance.course_number}-${section_id}`} >
          {course_instance.course_number}-{course_instance.section_numbers[i]} {resName(course_instance.professors[i])}
        </label>
      </div>
    )
  })
  

  let flex = calcFlex(visible, inline, size);
  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }
  
  let color = { 
    background: blockColors.get(course_instance.course_number)!,
  };
  
  console.log(course_instance.scheduled)
  let classes = `block ${isScheduled? '' : 'frosted'}`;
  if (interacted) {
    classes += " interacted " + edge;
    classes += (bottom)? ' bottom' : '';
  }
  else classes += " grow-h";

  let buttons = <button onClick={() => {}} className="submit-button">Select</button>
  if (isScheduled && course_instance.section_ids.length > 1) {
    buttons = (
      <>
        <button onClick={() => {}} className="submit-button">Request selected section</button>
        <button onClick={() => {}} className="submit-button">Offer selected section</button>
      </>
    )
  } else if (isScheduled) {
    buttons = <button onClick={() => {}} className="submit-button">Offer selected section</button>;
  } else {
    buttons = <button onClick={() => {}} className="submit-button">Request selected section</button>;
  }

  return (
    <div ref={ref} className={classes} onClick={() => setInteracted(true)}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { interacted? 
        <div className="pref-pane">
          <div className="pref-pane-title">Select course to trade</div>
          { formElements }

          <div className="fill"/>
          <div style={{marginBottom: '5px'}}/>

          { buttons }
        </div>
        : 
        <>
          <div className="fill"/>
          <div className={`block-text centered ${visible? '' : 'hidden'}`}>
            {course_instance.course_number}
          </div>
        </>
      }
    </div>
  )
}