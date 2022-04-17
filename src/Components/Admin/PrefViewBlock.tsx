import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { APIUserPreferenceEnum } from '../../modules/API';
import { CompressedCourseBlock } from '../../modules/BlockManipulation';
import contexts from '../APIContext';
import RenderBlockProps, { blockColors, calcFlex, statusColors } from '../Scheduling/BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CompressedCourseBlock
    linkIDs: number[] | null
  }
}

export const PrefViewBlock: FC<Props> = ({visible, size, inline, edge, bottom, data}) => {
  const [interacted, setInteracted] = useState<boolean>(false);
  const [userPrefs,] = useContext(contexts.userPrefs);
  const {course_instance, linkIDs} = data;
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

  const resStatusColor = (section_id: number) => {
    const status = userPrefs.get(section_id);
    if (status === undefined) return statusColors.get("Indifferent")!;
    return statusColors.get(status)!;
  }
  
  const resStatusText = (section_id: number) => {
    const status = userPrefs.get(section_id);
    switch (status) {
      case "Can't Do": return "(Can't)";
      case "Prefer Not To Do": return "(Don't Want)";
      case undefined:
      case "Indifferent": return "(Unspecified)";
      case "Prefer To Do": return "(Want)";
    }
  }

  const resName = (prof: string) => {
    if (prof === "TBA") {
      return '(professor TBA)';
    } else if (prof !== "") {
      return `with ${prof} `;
    } else {
      return '';
    }
  }

  let formElements: JSX.Element[] = [];
  let dotElements: JSX.Element[] = [];
  let seenDots: APIUserPreferenceEnum[] = [];
  course_instance.section_ids.forEach((section_id, i) => {
    formElements.push(
      <div key={`pref-row-${JSON.stringify(course_instance)}-${section_id}`} className="pref-row" style={{color: resStatusColor(section_id), margin: '0 5px 5px 5px'}}>
        {course_instance.course_number}-{course_instance.section_numbers[i]} {resName(course_instance.professors[i])} {resStatusText(section_id)}
      </div>
    )

    const pref = userPrefs.get(section_id);
    if (pref === "Indifferent" || pref === undefined || seenDots.includes(pref)) return;
    
    dotElements.push(
      <div key={`pref-dot-${JSON.stringify(course_instance)}-${section_id}`} className="pref-dot" style={{backgroundColor: resStatusColor(section_id)}}/>
    )
    seenDots.push(userPrefs.get(section_id)!);
  })
  

  let flex = calcFlex(visible, inline, size);
  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }
  
  let color = { background: blockColors.get(course_instance.course_number)! };
  let classes = "block";
  if (linkIDs !== null && linkIDs.length === 0) classes += " alert";
  if (interacted) {
    classes += " interacted " + edge;
    classes += (bottom)? ' bottom' : '';
  }
  else classes += " grow-h";

  return (
    <div ref={ref} className={classes} onClick={() => setInteracted(true)}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { interacted? 
        <div className="pref-pane">
          <div className="pref-pane-title">Preferences</div>
          { formElements }
          
          <div className="fill"/>
          <div style={{marginBottom: '5px'}}/>
        </div>
        : 
        <>
          <div className="dot-hstack">
            { dotElements }
          </div>
          <div className="fill"/>
          <div className={`block-text centered ${visible? '' : 'hidden'}`}>
            {course_instance.course_number}
          </div>
        </>
      }
    </div>
  )
}
