import React, { createContext, useState } from 'react';
import { SchedulingWindow } from '../Scheduling/SchedulingWindow';
import { SectionEditBlock } from './SectionEditBlock';

export interface EditableSection {
  section_id: number
  placeholder_proffessor_name: string
  capacity_peer_teachers: number
}

export const toUpdateContext = createContext<[
  EditableSection[], React.Dispatch<React.SetStateAction<EditableSection[]>>,
  number, React.Dispatch<React.SetStateAction<number>>
]>([
  [], 0 as any,
  0, 0 as any
]);

export const SectionEditButton = () => {
  const [editing, setEditingState] = useState(false);
  const [showRender, setShowRender] = useState(false);
  const toUpdateState = useState<EditableSection[]>([]);
  const unsavedState = useState<number>(0);

  const setEditing = (to: boolean) => {
    setEditingState(to);
    if (!to) {
      setTimeout(() => {
        setShowRender(to);
        toUpdateState[1]([]);
        unsavedState[1](0);
      }, 800);
    } else {
      setShowRender(to);
    }
  }

  const submitUpdates = () => {
    console.log(toUpdateState[0]);
  }

  return (
    <>
      <div className={`full-modal-container interact-blocks ${editing? '' : 'hidden'}`}>
        <div className={`full-modal ${editing? '' : 'hidden'}`}>
          < toUpdateContext.Provider value={[...toUpdateState, ...unsavedState]} >
            { showRender?
              < SchedulingWindow renderBlockType={SectionEditBlock} top={
                <div className="hstack render-header">
                  <button className="green button fill" onClick={submitUpdates} style={{marginLeft: '15px'}}>
                    Save{(toUpdateState[0].length > 0)? ` ${toUpdateState[0].length}` : ''} updated sections
                  </button>
                  <button className="red button" onClick={() => setEditing(false)}>Leave without saving</button>
                </div>
              } options={{selectable: false}}/>
              : <></>
            }
          </ toUpdateContext.Provider >
        </div>
      </div>
      <div className="admin-changeover">
        <button className="purple button full" style={{marginBottom: '0'}} onClick={() => setEditing(true)}>Edit course sections</button>
      </div>
    </>
  )
}
