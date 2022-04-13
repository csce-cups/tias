import React, { createContext, useState } from 'react';
import { SchedulingWindow } from '../Scheduling/SchedulingWindow';
import { SectionEditBlock } from './SectionEditBlock';

export interface EditableSection {
  section_id: number
  placeholder_proffessor_name: string
  capacity_peer_teachers: number
}

export const toUpdateContext = createContext<[EditableSection[], React.Dispatch<React.SetStateAction<EditableSection[]>>]>([
  [], 0 as any
]);

export const SectionEditButton = () => {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className={`full-modal-container interact-blocks ${editing? '' : 'hidden'}`}>
        <div className={`full-modal ${editing? '' : 'hidden'}`}>
          < SchedulingWindow renderBlockType={SectionEditBlock} top={
            <div className="hstack render-header">
              <button className="green button fill" style={{marginLeft: '15px'}}>Save updated sections</button>
              <button className="red button" onClick={() => setEditing(false)}>Leave without saving</button>
            </div>
          } options={{selectable: false}}/>
        </div>
      </div>
      <div className="admin-changeover">
        <button id="export-courses-button" className="purple button full" style={{marginBottom: '0'}} onClick={() => setEditing(true)}>Edit course sections</button>
      </div>
    </>
  )
}
