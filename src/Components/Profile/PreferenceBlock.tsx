import React, { FC, useEffect, useRef } from 'react'
import { CompressedCourseBlock } from '../../modules/BlockManipulation';
import RenderBlockProps, { calcFlex, blockColors } from '../Scheduling/BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CompressedCourseBlock
    linkIDs: number[] | null
  }
}

export const PreferenceBlock: FC<Props> = ({visible, size, inline, data}) => {
  const [interacted, setInteracted] = React.useState<boolean>(false);
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

  let flex = calcFlex(visible, inline, size);
  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }

  let color = { background: 'red' };
  if (linkIDs === null || linkIDs.length !== 0) {
    color.background = blockColors.get(course_instance.course_number)!
    if (color.background === undefined) console.error('Color not defined for:', JSON.stringify(course_instance))
  } else {
    color.background = '#800000';
  }

  let classes = "block";
  if (linkIDs !== null && linkIDs.length === 0) classes += " alert";
  if (interacted) classes += " interacted";
  else classes += " grow-h";

  return (
    <div ref={ref} className={classes} onClick={() => setInteracted(true)}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { interacted? 
        <div className="pref-pane">
          <div className="pref-pane-title">Select courses</div>
          { course_instance.section_numbers.map(section => (
            <div className="pref-row">
              <input type="checkbox"/>
              <div key={section}>{course_instance.course_number}-{section}</div>
            </div>
          ))}

          <div style={{marginBottom: '5px'}}/>
          <div className="pref-pane-title">Set preference</div>
          <button>Can't do</button>
          <button>Prefer not to do</button>
          <button>No Preference</button>
          <button>Prefer to do</button>
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

