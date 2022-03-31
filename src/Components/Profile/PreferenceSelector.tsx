import React, { useContext } from 'react'
import { SchedulingBlock } from '../Scheduling/SchedulingBlock'
import { SchedulingWindow } from '../Scheduling/SchedulingWindow'
import contexts from '../APIContext'
import { CourseBlockWeek } from '../../modules/API'
import { compressWeek } from '../../modules/BlockManipulation'
import { PreferenceBlock } from './PreferenceBlock'

export const PreferenceSelector = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(true);
  const [blockWeek, setBlockWeek] = useContext(contexts.blocks);
  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(blockWeek), setBlockWeek];

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
            noFilter: true,
            selectable: false
          }}/>
        </ contexts.blocks.Provider >
      </div>
    </div>
  )
}
