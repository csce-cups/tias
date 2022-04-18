import React, { createContext, useContext, useState } from 'react';
import API, { CourseBlockWeek, CourseBlockWeekKey, EditableSection } from '../../modules/API';
import contexts from '../APIContext';
import { SchedulingWindow } from '../Scheduling/SchedulingWindow';
import { SectionEditBlock } from './SectionEditBlock';

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
  const [blocks, setBlocks] = useContext(contexts.blocks);
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

  const submitUpdates = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.currentTarget;
    target.innerHTML = 'Updating...';
    API.updateSections(toUpdateState[0]).then(() => {
      target.innerHTML = 'Done!';
      const keys = Object.keys(blocks) as CourseBlockWeekKey[];
      toUpdateState[0].forEach(updatedSection => {
        for (const key of keys) {
          const where = blocks[key]?.findIndex(({section_id}) => section_id === updatedSection.section_id);
          if (where !== -1 && where !== undefined) {
            const replacement = {professor: updatedSection.placeholder_professor_name, capacity_peer_teachers: updatedSection.capacity_peer_teachers};
            blocks[key]![where] = {...blocks[key]![where], ...replacement};
            console.log(blocks[key]![where]);
            break;
          }
        }
      })
      setBlocks(blocks);
      toUpdateState[1]([]);
    }).catch(() => {
      target.innerHTML = 'An error occurred.';
    })
  }

  const leave = () => {
    if (toUpdateState[0].length > 0 && !window.confirm(`You have ${toUpdateState[0].length} unsaved sections, are you sure you want to leave?`)) return;
    setEditing(false);
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
                  <button className="red button" style={{width: '13em'}} onClick={leave}>{(toUpdateState[0].length > 0)? 'Leave without saving' : 'Exit'}</button>
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
