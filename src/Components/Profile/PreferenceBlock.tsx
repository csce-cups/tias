import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { APIUserPreferenceEnum } from '../../modules/API';
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.getAttribute('name')! as APIUserPreferenceEnum;
    Array.from(
      document.querySelectorAll(`input[type=checkbox][name="course-checkbox-${course_instance.section_id}"]:checked`)).map(
        (e: Element) => parseInt(e.getAttribute('data-sid')!
      )
    ).forEach(id => {
      userPrefs.set(id, value);
    })
    
    setUserPrefs(new Map(userPrefs));
  }

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
      case "Indifferent": return "";
      case "Prefer To Do": return "(Want)";
    }
  }

  const toggleCheck = (id: number) => {
    Array.from(document.querySelectorAll(`input[type=checkbox][data-sid="${id}"]`)).forEach((e: any) => e.checked = !e.checked);
  }

  const checkAll = (id: number) => {
    Array.from(document.querySelectorAll(`input[type=checkbox][name="course-checkbox-${id}"]`)).forEach((e: any) => e.checked = true);
  }

  let formElements: JSX.Element[] = [];
  let dotElements: JSX.Element[] = [];
  let seenDots: APIUserPreferenceEnum[] = [];
  course_instance.section_ids.forEach((section_id, i) => {
    formElements.push(
      <div key={`pref-row-${JSON.stringify(course_instance)}-${section_id}`} className="pref-row" onClick={() => toggleCheck(section_id)} >
        <input type="checkbox" name={`course-checkbox-${course_instance.section_id}`} data-sid={section_id} />
        <div style={{color: resStatusColor(section_id)}}>
          {course_instance.course_number}-{course_instance.section_numbers[i]} {resStatusText(section_id)}
        </div>
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
          <div key={`pref-row-checkall`} className="pref-row">
            <div className="check-all" onClick={() => checkAll(course_instance.section_id)}>Select All</div>
          </div>
          { formElements }

          <div className="fill"/>
          <div style={{marginBottom: '5px'}}/>
          <div className="pref-pane-title">Set preferences for selected sections</div>
          {/* <button className="cantdo">Can't do</button>
          <button className="prefernot">Prefer not to do</button>
          <button className="indiff">No Preference</button>
          <button className="prefer">Prefer to do</button> */}
          <button onClick={handleClick} name="Can't Do" className="cantdo">I Can't Do These</button>
          <button onClick={handleClick} name="Prefer Not To Do" className="prefernot">I Don't Want These</button>
          <button onClick={handleClick} name="Indifferent" className="indiff">No Preference</button>
          <button onClick={handleClick} name="Prefer To Do" className="prefer">I Want These</button>
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

