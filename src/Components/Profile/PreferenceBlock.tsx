import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { CompressedCourseBlock } from '../../modules/BlockManipulation';
import contexts from '../APIContext';
import RenderBlockProps, { calcFlex, blockColors, statusColors } from '../Scheduling/BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CompressedCourseBlock
    linkIDs: number[] | null
  }
}

export const PreferenceBlock: FC<Props> = ({visible, size, inline, data}) => {
  const [interacted, setInteracted] = useState<boolean>(false);
  const [userPrefs, setUserPrefs] = useContext(contexts.userPrefs);
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

  let color = { background: blockColors.get(course_instance.course_number)! };

  let classes = "block";
  if (linkIDs !== null && linkIDs.length === 0) classes += " alert";
  if (interacted) classes += " interacted";
  else classes += " grow-h";

  const resStatusColor = (section_id: number) => {
    const status = userPrefs.get(section_id);
    if (status === undefined) return statusColors.get("Indifferent")!;
    return statusColors.get(status)!;
  }

  const resStatusText = (section_id: number) => {
    const status = userPrefs.get(section_id);
    switch (status) {
      case "Can't Do": return "(Can't Do)";
      case "Prefer Not To Do": return "(Prefer No)";
      case "Indifferent": return "";
      case "Prefer To Do": return "(Prefer Yes)";
    }
  }

  return (
    <div ref={ref} className={classes} onClick={() => setInteracted(true)}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { interacted? 
        <div className="pref-pane">
          <div className="pref-pane-title">Select courses</div>
          { course_instance.section_ids.map((section_id, i) => (
            <div className="pref-row">
              <input type="checkbox"/>
              <div key={`pref-row-${section_id}`} style={{color: resStatusColor(section_id)}}>
                {course_instance.course_number}-{course_instance.section_numbers[i]} {resStatusText(section_id)}
              </div>
            </div>
          ))}

          <div style={{marginBottom: '5px'}}/>
          <div className="pref-pane-title">Set preference</div>
          <button className="cantdo">Can't do</button>
          <button className="prefernot">Prefer not to do</button>
          <button className="indiff">No Preference</button>
          <button className="prefer">Prefer to do</button>
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

