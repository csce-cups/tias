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

  const renderScheduled = (retData: CourseBlock[]) => {    
    let retFormat: DisplayBlock[] = [];
    let ret: JSX.Element[] = [];

    const shortDays = ['M', 'T', 'W', 'R', 'F'];
    const dayMap = new Map<string, 'M' | 'T' | 'W' | 'R' | 'F'>(
      [
        ['Monday', 'M'],
        ['Tuesday', 'T'],
        ['Wednesday', 'W'],
        ['Thursday', 'R'],
        ['Friday', 'F']
      ]
    )

    const cmpDay = (a: 'M' | 'T' | 'W' | 'R' | 'F', b: 'M' | 'T' | 'W' | 'R' | 'F') => {
      if (shortDays.indexOf(a) < shortDays.indexOf(b)) return -1;
      else if (shortDays.indexOf(a) > shortDays.indexOf(b)) return 1;
      return 0;
    }

    retData.sort((a, b) => {
      if (cmpDay(dayMap.get(a.weekday)!, dayMap.get(b.weekday)!) !== 0) return cmpDay(dayMap.get(a.weekday)!, dayMap.get(b.weekday)!);
      else if (a.start_time < b.start_time) return -1;
      else if (a.start_time > b.start_time) return 1;
      else if (a.course_number < b.course_number) return -1;
      else if (a.course_number > b.course_number) return 1;
      else if (a.section_number < b.section_number) return -1;
      else if (a.section_number > b.section_number) return 1;
      return 0;
    }).forEach(block => {
      const where = retFormat.findIndex(b => b.course_number === block.course_number && b.section_number === block.section_number);
      if (where === -1) retFormat.push({...block, days: [dayMap.get(block.weekday) as 'M' | 'T' | 'W' | 'R' | 'F']})
      else retFormat[where].days.push(dayMap.get(block.weekday) as 'M' | 'T' | 'W' | 'R' | 'F');
    })

    retFormat.forEach(block => {
      ret.push(
        <div className="schedule-info-element" key={`sie-${JSON.stringify(block)}`}>
          <div>
            {block.department}: {block.course_number}-{block.section_number}
          </div>
          <div>
            {formatDate(block.start_time)}-{formatDate(block.end_time)} {block.days.join('')}
          </div>
          <div>
            Professor {block.professor}
          </div>
          <div>
            {block.place}
          </div>
        </div>
      )
    })

    return ret;
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
