import React from 'react'
import { SchedulingBlock } from '../Scheduling/SchedulingBlock'
import { SchedulingWindow } from '../Scheduling/SchedulingWindow'

export const PreferenceSelector = () => {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

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
        < SchedulingWindow renderBlockType={SchedulingBlock}/>
      </div>
    </div>
  )
}
