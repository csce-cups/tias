import React, { FC } from 'react'
import { Hat } from '../Misc/Hat';
import { APICourseBlock } from '../../modules/API';

const colors = new Map()
colors.set(121, '#0086B6');
colors.set(221, '#434F6F');
colors.set(222, '#405AB9');
colors.set(312, '#A78B57');
colors.set(313, '#437548');
colors.set(314, '#787256');
colors.set(315, '#009489');

interface Props {
  course_instance?: APICourseBlock,
  visible: boolean,
  linkIDs: number[],
  spacer?: boolean,
  size?: string
}

export const SchedulingBlock: FC<Props> = ({course_instance, visible, linkIDs, spacer, size}) => {
  let flex: string | undefined = '0 0 0';
  if (size && visible && size === 'auto') flex = `1 1 auto`
  else if (size && visible) flex = `0 0 ${size}`
  else if (visible && spacer) flex = '1 1 auto'
  else if (visible) flex = undefined

  const isVisible = {
    // width: visible? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }

  const isContentVisible = {
    ...isVisible,
    display: visible? undefined : 'none'
  }

  if (spacer === true) return <div className="block spacer" style={isVisible}/>

  return (
    <div className="block" 
      title={`${course_instance!.course_number}-${course_instance!.section_number}`} 
      style={{backgroundColor: colors.get(course_instance!.course_number), ...isVisible}}
    >
      <div className="hat-container">
        {linkIDs.map(id => (< Hat key={id} linkID={id} />))}
      </div>
      <div className="fill"/>
      <div className="block-text" style={isContentVisible}>
        {course_instance!.course_number} {course_instance!.section_number}
      </div>
    </div>
  )
}
