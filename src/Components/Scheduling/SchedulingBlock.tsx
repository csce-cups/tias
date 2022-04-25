import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { APIUserPreferenceEnum, CourseBlock, CourseBlockWeekKey, Person } from '../../modules/API';
import { findCollisions, formatDate } from '../../modules/BlockFunctions';
import uuid from '../../uuid';
import contexts from '../APIContext';
import { Hat } from '../Misc/Hat';
import { BlockUpdateAction, PersonPrefLink } from '../APIContextHelper';
import RenderBlockProps, { blockColors, calcFlex, statusColors } from './BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock
    linkIDs: number[] | null
  }
}

export const SchedulingBlock: FC<Props> = (({visible, size, inline, options, data}) => {
  const {course_instance, linkIDs: linkIDs_super} = data;
  const [linkIDs, setLinkIDs] = useState<number[] | null>(linkIDs_super);
  const [interacted, setInteracted] = useState(course_instance.opened || false);
  const [,, viableEmployeesC] = useContext(contexts.allViableCourses);
  const [employees,] = useContext(contexts.employees);
  const [viableEmployees, setViableEmployees] = useState<PersonPrefLink[]>([]);
  const [disabled, setDisabled] = useState(true);
  const [toUpdate, setToUpdate] = useState(course_instance.updated || false);
  const [blockWeek, ] = useContext(contexts.blocks);
  const blockUpdate = useContext(contexts.blockUpdate);
  const bid = `edit-schedule-btn-${uuid()}`;
  const sid = `drowdown-${uuid()}`;

  const ref: any = useRef(null);
  
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

  let bgcolor = { backgroundColor: 'red' };
  if (linkIDs === null || linkIDs.length !== 0 || course_instance.capacity_peer_teachers === 0 || true) {
    bgcolor.backgroundColor = blockColors.get(course_instance.course_number)!
    if (bgcolor.backgroundColor === undefined) console.error('Color not defined for:', JSON.stringify(course_instance))
  } else {
    bgcolor.backgroundColor = '#800000';
  }

  let className = 'block';
  if (linkIDs !== null && linkIDs.length === 0 && course_instance.capacity_peer_teachers !== 0 && false) className += ' alert';
  if (interacted) className += ' interacted';
  if (toUpdate) className += ' edited';

  const createList = () => {
    let elements: JSX.Element[] = [];
    let es: {employee: Person, pref: APIUserPreferenceEnum}[] = [];
    viableEmployees.forEach(({person_id, pref}) => {
      const employee = employees.find(e => e.person_id === person_id)!;
      if (pref === "Can't Do" || employee === undefined) return;
      es.push({employee, pref});
    });

    elements.push(
      <option key={"default"} value="none" style={{color: 'white', ...bgcolor}}>
        Select a peer teacher
      </option>  
    )
    es.sort((a, b) => {
      const aForbidden = course_instance.forbidden?.includes(a.employee.person_id);
      const bForbidden = course_instance.forbidden?.includes(b.employee.person_id);
      if (aForbidden && !bForbidden) return 1;
      if (!aForbidden && bForbidden) return -1;

      const ranks = { "Can't Do": 0, "Prefer Not To Do": 1, "Indifferent": 2, "Prefer To Do": 3 };
      const diff = (b.pref? ranks[b.pref] : 2) - (a.pref? ranks[a.pref] : 2);
      if (diff !== 0) return diff;
      return a.employee.last_name.localeCompare(b.employee.last_name);
    }).forEach(({employee, pref}) => {
      let text = resStatusText(pref);
      let color = resStatusColor(pref);
      if (course_instance.forbidden?.includes(employee.person_id)) {
        text = "(TIME CONFLICT)";
        color = "red";
      }
      elements.push(
        <option value={employee.person_id} key={employee?.person_id} style={{color, ...bgcolor}}>
          {linkIDs?.includes(employee.person_id)? '> ' : ''} { employee?.first_name } { employee?.last_name } { text }
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
      if (course_instance.forbidden?.includes(+val)) {
        t.innerHTML = "TIME CONFLICT: A scheduled section makes this peer teacher unavailable at this time";
        t.setAttribute('action-type', 'error');
        setDisabled(true);
      } else if (linkIDs?.includes(+e.target.value)) {
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
        setTimeout(() => {
          blockUpdate([{
            action: "block", 
            block: course_instance, 
            splice: {
              opened: false
            }
          }]);
        }, 200);
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
    if (options?.editing?.bool[0]) {
      setInteracted(true);
    }
  }

  const updateSchedule = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const t = e.currentTarget as HTMLButtonElement;
    const selectElement = document.getElementById(sid) as HTMLSelectElement;
    const val = selectElement.value;
    const type = t.getAttribute('action-type')! as "add" | "remove" | "reset" | "disabled" | "error";
    const collisions = (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as CourseBlockWeekKey[]).map(k => findCollisions(blockWeek[k], course_instance)).flat();
    let updates: BlockUpdateAction[] = [];
    if (!toUpdate && !["reset", "disabled", "error"].includes(type)) {
      setToUpdate(true);
      options!.editing!.count[1](options!.editing!.count[0] + 1);
    }

    let newLinkIDs = linkIDs;
    if (type === "add") {
      newLinkIDs = linkIDs?.concat(+val) ?? [+val];
      t.innerHTML = `Remove from ${course_instance.department} ${course_instance.course_number}-${course_instance.section_number}`;
      t.setAttribute('action-type', 'remove');
      collisions.forEach(b => {
        if (!b.forbidden?.includes(+val)) {
          updates.push({
            action: "block",
            block: b,
            splice: {
              forbidden: b.forbidden?.concat(+val) ?? [+val]
            }
          })
        }
      })
    } else if (type === "remove") {
      newLinkIDs = linkIDs?.filter(id => id !== +val) ?? [];
      t.innerHTML = `Add to ${course_instance.department} ${course_instance.course_number}-${course_instance.section_number}`;
      t.setAttribute('action-type', 'add');
      collisions.forEach(b => {
        updates.push({
          action: "block",
          block: b,
          splice: {
            forbidden: b.forbidden?.filter(id => id !== +val) ?? []
          }
        })
      })
    } else if (type === "reset") {
      const changes = newLinkIDs?.filter(id => !course_instance.ronly_scheduled?.includes(id));
      newLinkIDs = course_instance.ronly_scheduled || null;
      
      if (newLinkIDs?.some(id => course_instance.forbidden?.includes(id))) {
        const conflict = employees.find(e => e.person_id === newLinkIDs?.find(id => course_instance.forbidden?.includes(id)))!;
        alert(`Unable to reset section, ${conflict.first_name} ${conflict.last_name} has been manually scheduled to a time that conflicts with this section. Remove them from the conflicting section before resetting.`);
        return;
      }

      collisions.forEach(b => {
        updates.push({
          action: "block",
          block: b,
          splice: {
            forbidden: b.forbidden?.filter(id => !changes?.includes(id)) ?? [],
          }
        })
      })
    } else return;

    // We're back to our original state
    let isReset = false;
    if (newLinkIDs?.length === course_instance.ronly_scheduled?.length && newLinkIDs?.every(id => course_instance.ronly_scheduled?.includes(id))) {
      isReset = true;
      if (toUpdate) options!.editing!.count[1](options!.editing!.count[0] - 1);
      setToUpdate(false);
      setDisabled(true);

      const btn = document.getElementById(bid)!;
      btn.innerHTML = "Select a peer teacher";
      btn.setAttribute('action-type', 'disabled');
      selectElement.value = "none";
    }

    blockUpdate([
      ...updates,
      {
        action: "section", 
        block: course_instance, 
        splice: {
          scheduled: newLinkIDs,
          updated: !isReset,
        }
      },
      {
        action: "block", 
        block: course_instance, 
        splice: {
          opened: interacted
        }
      }
    ]);

    setLinkIDs(newLinkIDs);
  }

  return (
    <div className={className}
      ref={ref}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...bgcolor, ...isVisible}}
      onClick={handleClick}
      data-testid="block"
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
            <div className="hstack" style={{position: 'relative', width: '100%'}}>
              <div className="pref-pane-title">Desired PT Count: {course_instance.capacity_peer_teachers}</div>
              <div className="fill"/>
              <button disabled={!toUpdate} style={{width: 'fit-content', padding: '0 5px', margin: '0'}} className="cantdo submit-button" onClick={updateSchedule} action-type="reset">Reset</button>
            </div>
            <button id={bid} disabled={disabled} className="indiff submit-button" onClick={updateSchedule} action-type="disabled">Select a peer teacher</button>
            <select id={sid} className="manual" name="employee" defaultValue="none" style={{...bgcolor, color: 'white'}} onChange={handleChange}>
              { createList() }
            </select>
          </>
          : <></>
        }
      </div>
    </div>
  )
})