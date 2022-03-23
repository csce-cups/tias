import React, { FC } from 'react'
import { Hat } from '../Misc/Hat';
import { APICourseBlock } from '../../modules/API';

const colors = new Map()
colors.set(121, '#0086B6');
colors.set(221, '#434F6F');
colors.set(312, 'white');
colors.set(313, '#405AB9');
colors.set(314, 'white');
colors.set(315, '#009489');

interface Props {
  course_instance: APICourseBlock,
  visible: boolean,
  linkIDs: number[]
}

export const SchedulingBlock: FC<Props> = ({course_instance, visible, linkIDs}) => {
  const isVisible = {
    width: visible? undefined : 0,
    flex: visible? undefined : '0 0 auto',
    margin: visible? undefined : 0
  }

  const isContentVisible = {
    ...isVisible,
    display: visible? undefined : 'none'
  }

  return (
    <div className="block" 
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{backgroundColor: colors.get(course_instance.course_number), ...isVisible}}
    >
      <div className="hat-container">
        {linkIDs.map(id => (< Hat key={id} linkID={id} />))}
      </div>
      <div className="fill"/>
      <div className="block-text" style={isContentVisible}>
        {course_instance.course_number} {course_instance.section_number}
      </div>
    </div>
  )
}
