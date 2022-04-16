import React, { FC, useState } from 'react';
import { CourseBlock } from '../../modules/API';
import { Hat } from '../Misc/Hat';
import RenderBlockProps, { blockColors, calcFlex } from './BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock
    linkIDs: number[] | null
  }
}

export const SchedulingBlock: FC<Props> = ({visible, size, inline, options, data}) => {
  const [interacted, setInteracted] = useState<boolean>(false);
  const formatDate = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = (hour === 12) ? 12 : hour % 12;
    const minutes = minute < 10 ? `0${minute}` : minute;
    return `${hour12}:${minutes} ${ampm}`;
  }

  const {course_instance, linkIDs} = data;
  let flex = calcFlex(visible, inline, size);

  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }
  
  const body = () => {
    if (linkIDs === null || linkIDs.length === 0 && course_instance.capacity_peer_teachers === 0 ) return <></>
    else if (linkIDs.length === 0 && course_instance.capacity_peer_teachers !== 0) {
      return (
        <div className="hat-container alert">
          < Hat linkID={-1} />
        </div>
      )
    } else {
      return (
        <div className="hat-container">
          {linkIDs?.map(id => (< Hat key={id} linkID={id} />))}
        </div>
      )
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (options?.editing) {
      setInteracted(true);
    }
  }

  let color = { backgroundColor: 'red' };
  if (linkIDs === null || linkIDs.length !== 0 || course_instance.capacity_peer_teachers === 0) {
    color.backgroundColor = blockColors.get(course_instance.course_number)!
    if (color.backgroundColor === undefined) console.error('Color not defined for:', JSON.stringify(course_instance))
  } else {
    color.backgroundColor = '#800000';
  }

  let className = 'block';
  if (linkIDs !== null && linkIDs.length === 0 && course_instance.capacity_peer_teachers !== 0) className += ' alert';
  if (interacted) className += ' interacted';

  return (
    <div className={className}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
      onClick={handleClick}
    >
      { body() }
      <div className="fill"/>
      <div className={`block-text ${visible? '' : 'hidden'}`}>
        {course_instance.course_number} {course_instance.section_number}
      </div>
      <div className={`vstack block-detail ${visible? '' : 'hidden'}`}>
        <div>
          <span>{course_instance.department} {course_instance.course_number}-{course_instance.section_number}&nbsp;</span>
          <span>{formatDate(course_instance.start_time)}-{formatDate(course_instance.end_time)}</span>
        </div>
        <div>
          {course_instance.place}
        </div>
      </div>
    </div>
  )
}
