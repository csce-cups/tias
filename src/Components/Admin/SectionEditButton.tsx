import React, { useState } from 'react'
import { SchedulingBlock } from '../Scheduling/SchedulingBlock';
import { SchedulingRender } from '../Scheduling/SchedulingRender';
import { SchedulingWindow } from '../Scheduling/SchedulingWindow';

export const SectionEditButton = () => {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className={`full-modal ${editing? '' : 'hidden'}`}>
        < SchedulingWindow renderBlockType={SchedulingBlock} top={
          <div className="hstack render-header">
            <button className="green button fill" style={{marginLeft: '15px'}}>Save updated sections</button>
            <button className="red button" onClick={() => setEditing(false)}>Leave without saving</button>
          </div>
        }/>
      </div>
      <div className="admin-changeover">
        <button id="export-courses-button" className="purple button full" style={{marginBottom: '0'}} onClick={() => setEditing(true)}>Edit course sections</button>
      </div>
    </>
  )
}
