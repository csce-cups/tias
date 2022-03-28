import React, { FC } from 'react'
import { Hat } from '../Misc/Hat';
import { APICourseBlock } from '../../modules/API';

const colors = new Map();
colors.set(110, '#4F405A');
colors.set(111, '#826a94');
colors.set(120, '#0e544f');
colors.set(121, '#0e544f');
colors.set(206, '#006b47');
colors.set(221, '#009489');
colors.set(222, '#5358AE');
colors.set(312, '#0086B6');
colors.set(313, '#434F6F');
colors.set(314, '#807391');
colors.set(315, '#6e438c');

interface Props {
  course_instance?: APICourseBlock,
  visible: boolean,
  linkIDs: number[] | null,
  spacer?: boolean,
  size?: string,
  inline?: boolean,
}

export const SchedulingBlock: FC<Props> = ({course_instance, visible, linkIDs, spacer, size, inline}) => {
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

  if (spacer === true) return <div className="block spacer" style={isVisible}/>

  const body = () => {
    if (linkIDs === null) return <></>
    else if (linkIDs.length === 0) {
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

  let color = {background: 'red'};
  if (linkIDs === null || linkIDs.length !== 0) {
    color.background = colors.get(course_instance!.course_number)
    if (color.background === undefined) console.error('Color not defined for:', JSON.stringify(course_instance))
  } else {
    color.background = '#800000';
  }

  return (
    <div className={`block ${(linkIDs !== null && linkIDs.length === 0)? 'alert' : ''}`}
      title={`${course_instance!.course_number}-${course_instance!.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { body() }
      <div className="fill"/>
      <div className="block-text">
        {course_instance!.course_number} {course_instance!.section_number}
      </div>
      <div className="vstack block-detail">
        <div>
          {course_instance!.department} {course_instance!.course_number}-{course_instance!.section_number}
        </div>
        <div>
          {course_instance!.place}
        </div>
      </div>
    </div>
  )
}
