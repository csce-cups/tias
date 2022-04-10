import React, { FC, useEffect, useRef, useState } from 'react'
import { Hat } from '../Misc/Hat';
import { CourseBlock } from '../../modules/API';
import RenderBlockProps, { calcFlex, blockColors } from '../Scheduling/BlockBase';

interface DisplayBlock extends CourseBlock {
  days: ('M' | 'T' | 'W' | 'R' | 'F')[]
}

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock | null
    shift: boolean
  }
}

export const DisplayBlock: FC<Props> = ({visible, size, inline, data}) => {
  const {course_instance, shift} = data;
  const ref: any = useRef(null);
  const [interacted, setInteracted] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = (hour === 12) ? 12 : hour % 12;
    const minutes = minute < 10 ? `0${minute}` : minute;
    return `${hour12}:${minutes} ${ampm}`;
  }

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

  let flex = calcFlex(visible, inline, size);

  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }

  if (course_instance === null) {
      return (
        <div className="block frosted standalone" style={{outline: '0'}}>
          <div className="fill"/>
          <div style={{margin: '5px'}}>
            None selected
          </div>
        </div>
      )
  }

  let color = { backgroundColor: blockColors.get(course_instance.course_number)! };
  let classes = "block standalone";
  if (interacted) classes += " viewed";
  else classes += " grow-h";

  if (shift) classes += " block-right";
  else classes += " block-left";

  return (
    <div ref={ref} className={classes} onClick={() => setInteracted(true)}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { interacted? 
        <div className="pref-pane">
          <div>
            {course_instance.department}: {course_instance.course_number}-{course_instance.section_number}
          </div>
          <div>
            {''} {formatDate(new Date(course_instance.start_time))} - {formatDate(new Date(course_instance.end_time))}
          </div>
          <div>
            Professor {course_instance.professor}
          </div>
          <div>
            {course_instance.place}
          </div>
        </div>
        : 
        <>
          <div className="fill"/>
          <div className={`block-text centered ${visible? '' : 'hidden'}`}>
            {course_instance.course_number}-{course_instance.section_number}
          </div>
        </>
      }
    </div>
  )
}
