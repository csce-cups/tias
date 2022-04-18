import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import API, { APIUserPreferenceEnum, CourseBlock, Person } from '../../modules/API';
import uuid from '../../uuid';
import contexts from '../APIContext';
import { Hat } from '../Misc/Hat';
import RenderBlockProps, { blockColors, calcFlex, statusColors } from './BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock
    linkIDs: number[] | null
  }
}

export const SchedulingBlock: FC<Props> = ({visible, size, inline, options, data}) => {
  const [interacted, setInteracted] = useState<boolean>(false);
  const [,, viableEmployeesC] = useContext(contexts.allViableCourses);
  const [employees,] = useContext(contexts.employees);
  const [viableEmployees, setViableEmployees] = useState<{id: number, pref: APIUserPreferenceEnum}[]>([]);
  const [disabled, setDisabled] = useState(true);
  const bid = `edit-schedule-btn-${uuid()}`;
  const sid = `drowdown-${uuid()}`;

  const ref: any = useRef(null);
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

  const resStatusColor = (status: APIUserPreferenceEnum | undefined | null) => {
    if (status === undefined || status === null) return statusColors.get("Indifferent")!;
    return statusColors.get(status)!;
  }
  
  const resStatusText = (status: APIUserPreferenceEnum | undefined) => {
    switch (status) {
      case "Can't Do": return "(Can't)";
      case "Prefer Not To Do": return "(Don't Want)";
      case undefined:
      case "Indifferent": return "";
      case "Prefer To Do": return "(Want)";
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

  const createList = () => {
    let elements: JSX.Element[] = [];
    let es: {employee: Person, pref: APIUserPreferenceEnum}[] = [];
    viableEmployees.forEach(({id, pref}) => {
      const employee = employees.find(e => e.person_id === id)!;
      if (pref === "Can't Do") return;
      es.push({employee, pref});
    });

    elements.push(
      <option key={"default"} value="none" style={{color: 'white', ...color}}>
        Select a peer teacher
      </option>  
    )

    es.sort((a, b) => {
      const ranks = { "Can't Do": 0, "Prefer Not To Do": 1, "Indifferent": 2, "Prefer To Do": 3 };
      const diff = (b.pref? ranks[b.pref] : 2) - (a.pref? ranks[a.pref] : 2);
      if (diff !== 0) return diff;
      return a.employee.last_name.localeCompare(b.employee.last_name);
    }).forEach(({employee, pref}) => {
      elements.push(
        <option value={employee.person_id} key={employee?.person_id} style={{color: resStatusColor(pref), ...color}}>
          {linkIDs?.includes(employee.person_id)? '> ' : ''} { employee?.first_name } { employee?.last_name } { resStatusText(pref) }
        </option>  
      )
    });
    return elements;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const t = document.getElementById(bid)!;
    if (val === "none") {
      setDisabled(true);
      t.innerHTML = "Select a peer teacher";
      t.setAttribute('action-type', 'disabled');
    } else {
      setDisabled(false);
      if (linkIDs?.includes(+e.target.value)) {
        t.innerHTML = `Remove from ${course_instance.department} ${course_instance.course_number}-${course_instance.section_number}`;
        t.setAttribute('action-type', 'remove');
      } else {
        t.innerHTML = `Add to ${course_instance.department} ${course_instance.course_number}-${course_instance.section_number}`;
        t.setAttribute('action-type', 'add');
      } 
    }
  }

  useEffect(() => {
    setViableEmployees(viableEmployeesC.get(course_instance.section_id) ?? []);
  }, [viableEmployeesC]);
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && interacted) {
        setInteracted(false);
        setDisabled(true);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  
  const hats = () => {
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

  const updateSchedule = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const t = e.currentTarget as HTMLButtonElement;
    const selection = (document.getElementById(bid) as HTMLSelectElement).value;
    const type = t.getAttribute('action-type')! as "add" | "remove";
    if (type === "add") {
      console.log("Adding", selection);
    } else if (type === "remove") {
      console.log("Remove", selection);
    }
  }

  return (
    <div className={className}
      ref={ref}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
      onClick={handleClick}
    >
      { hats() }
      <div className="fill"/>
      <div className={`block-text ${visible? '' : 'hidden'}`}>
        {course_instance.course_number} {course_instance.section_number}
      </div>
      <div className={`vstack block-detail ${visible? '' : 'hidden'}`}>
        <div className="ps5">
          <span>{course_instance.department} {course_instance.course_number}-{course_instance.section_number}&nbsp;</span>
          <span>{formatDate(course_instance.start_time)}-{formatDate(course_instance.end_time)}</span>
        </div>
        <div className="ps5">
          {course_instance.place}
        </div>
        { interacted?
          <>
            <div className="m5"/>
            <div className="pref-pane-title">Desired PT Count: {course_instance.capacity_peer_teachers}</div>
            <button id={bid} disabled={disabled} className="submit-button" onClick={updateSchedule} action-type="disabled">Select a peer teacher</button>
            <select id={sid} className="manual" name="employee" defaultValue="none" style={{...color, color: 'white'}} onChange={handleChange}>
              { createList() }
            </select>
          </>
          : <></>
        }
      </div>
    </div>
  )
}
