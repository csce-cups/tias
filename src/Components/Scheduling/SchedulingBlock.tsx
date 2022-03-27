import React, { FC } from 'react'
import { Hat } from '../Misc/Hat';
import { APICourseBlock } from '../../modules/API';

const colors = new Map()
// colors.set(121, '#713275');
// colors.set(221, '#443989');
// colors.set(222, '#4C698A');
// colors.set(312, '#4F8970');
// colors.set(313, '#2B6737');
// colors.set(314, '#677D5D');
// colors.set(315, '#394708');

colors.set(121, '#0e544f');
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

  const hats = () => {
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

  return (
    <div className="block" 
      title={`${course_instance!.course_number}-${course_instance!.section_number}`} 
      style={{backgroundColor: colors.get(course_instance!.course_number), ...isVisible}}
    >
      { hats() }
      <div className="fill"/>
      <div className="block-text">
        {course_instance!.course_number} {course_instance!.section_number}
      </div>
    </div>
  )
}
