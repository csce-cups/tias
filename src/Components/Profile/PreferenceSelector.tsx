import React, { createContext, useContext, useEffect, useState } from 'react'
import { SchedulingBlock } from '../Scheduling/SchedulingBlock'
import { SchedulingWindow } from '../Scheduling/SchedulingWindow'
import contexts from '../APIContext'
import { CourseBlock, CourseBlockWeek } from '../../modules/API'
import { compressWeek } from '../../modules/BlockManipulation'
import { PreferenceBlock } from './PreferenceBlock'

export const PreferenceSelector = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [blockWeek, setBlockWeek] = useContext(contexts.blocks);
  const [userQuals, setUserQuals] = useContext(contexts.userQuals);
  const [filter, setFilter] = useState(new Map<number, boolean>());
  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(blockWeek), setBlockWeek];

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
          <input className="fill" type="number" placeholder="2" style={{marginRight: '5px'}}/>
        </div>
        < contexts.blocks.Provider value={blocksPayload} >
          < SchedulingWindow renderBlockType={PreferenceBlock} options={{
            noHeader: true,
            noBorder: true,
            selectable: false,
            filter: [filter, setFilter]
          }}/>
        </ contexts.blocks.Provider >
      </div>
    </div>
  )
}
