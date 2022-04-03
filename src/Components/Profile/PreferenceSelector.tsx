import React, { createContext, useContext, useEffect, useState } from 'react'
import { SchedulingBlock } from '../Scheduling/SchedulingBlock'
import { SchedulingWindow } from '../Scheduling/SchedulingWindow'
import contexts from '../APIContext'
import API, { CourseBlock, CourseBlockWeek, parseCookie } from '../../modules/API'
import { compressWeek } from '../../modules/BlockManipulation'
import { PreferenceBlock } from './PreferenceBlock'
import uuid from '../../uuid'

export const PreferenceSelector = () => {
  const input_id = uuid();
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [blockWeek, setBlockWeek] = useContext(contexts.blocks);
  const [userQuals, setUserQuals] = useContext(contexts.userQuals);
  const [userPrefs, setUserPrefs] = useContext(contexts.userPrefs);
  const [filter, setFilter] = useState(new Map<number, boolean>());
  const [employees, setEmployees] = useContext(contexts.employees);
  const thisEmployee = employees.find(e => e.person_id === +parseCookie().tias_user_id);
  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(blockWeek), setBlockWeek];

  const submit = (event: any) => {

    const newPrefSections = +(document.getElementById(input_id)! as HTMLInputElement).value;
    let updatePrefSectionVal = undefined;
    if (thisEmployee && newPrefSections !== thisEmployee.desired_number_assignments) {
      updatePrefSectionVal = newPrefSections;
      employees[employees.findIndex(e => e.person_id === +parseCookie().tias_user_id)!].desired_number_assignments = newPrefSections;
    }
    
    document.getElementById("submit-prefs")?.setAttribute('value', 'Saving...');
    
    API.sendUserPreferences(parseCookie().tias_user_id, userPrefs, updatePrefSectionVal).then(() => {
      document.getElementById("submit-prefs")?.setAttribute('value', 'Saved!');
      setEmployees(employees);
    }).catch(err => {
      document.getElementById("submit-prefs")?.setAttribute('value', 'Preferences could not be saved.');
    });

    event.preventDefault();
  }

  useEffect(() => {
    let filterMap = new Map<number, boolean>();
    userQuals.forEach(qual => {
      filterMap.set(parseInt(qual.course_number), qual.qualified);
    })
    setFilter(filterMap);
  }, [userQuals]);

  return (
    <div className={`preferences-container ${collapsed? 'collapsed' : ''}`}>
      <div className={`hstack header ${collapsed? 'collapsed' : ''}`} onClick={() => setCollapsed(!collapsed)}>
        <div className="header-content">Section Preferences</div>
        <div className="fill" />
        <div className="arrow-container">
          <div className={`arrow ${collapsed? 'left': 'down'}`} />
        </div>
      </div>
      <div className={`${collapsed? "collapsed " : ""}profile-render`}>
        <div className="hstack">
          <div className="dropdown-label">
            Preferred Number of Lab Sections:  
          </div>
          <input id={input_id} type="number" placeholder={thisEmployee? `${thisEmployee.desired_number_assignments}` : '2'} style={{margin: '0 5px'}}/>
        </div>
        < contexts.blocks.Provider value={blocksPayload} >
          < SchedulingWindow renderBlockType={PreferenceBlock} options={{
            noHeader: true,
            noBorder: true,
            selectable: false,
            filter: [filter, setFilter]
          }}/>
        </ contexts.blocks.Provider >
        <input id="submit-prefs" onClick={submit} type="submit" className="blue button submit" value="Save Preferences"/>
      </div>
    </div>
  )
}
