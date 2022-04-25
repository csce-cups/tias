import React, { FC, useContext, useState } from 'react';
import API, { CourseBlockWeek } from '../../modules/API';
import { inferSchedule } from '../../modules/BlockFunctions';
import contexts from '../APIContext';

interface Props {
  editingState: {
    bool: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    count: [number, React.Dispatch<React.SetStateAction<number>>]
  }
}

export const EditButton: FC<Props> = ({editingState}) => {
  const [editing, setEditing] = editingState.bool;
  const [editingCount, setEditingCount] = editingState.count;
  const [allViable, setAllViable, ] = useContext(contexts.allViableCourses);
  const [blocks, setBlocks] = useContext(contexts.blocks);
  const [schedule, setSchedule] = useContext(contexts.loadedSchedule);
  const [displayCancelButton, setDisplayCancelButton] = useState(true);

  const fetchValidEmployees = () => {
    if (allViable.size === 0) {
      return API.fetchAllViableCourses().then(res => {
        setAllViable(res);
      });
    } else return new Promise<void>(r => r());
  }

  const startOrSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const t = e.currentTarget
    if (!editing) {
      t.innerHTML = 'Loading...';
      fetchValidEmployees().then(() => {
        setEditing(true);
        t.innerHTML = 'Stop Editing';
      })
      setEditingCount(0);
    } else {
      const newSchedule = inferSchedule(blocks);
      setDisplayCancelButton(false);
      if (editingCount > 0) {
        t.innerHTML = 'Saving...';
        API.sendSavedSchedule(newSchedule).then(() => {
          const keys: (keyof CourseBlockWeek)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          t.innerHTML = 'Saved!';
          keys.forEach(k => blocks[k] = blocks[k]?.map(b => ({
            ...b,
            ronly_scheduled: b.scheduled || null,
            opened: false,
            updated: false
          })) || null);
          
          setEditingCount(0);
          setEditing(false);
          setBlocks(blocks);
          setSchedule(newSchedule);
          setDisplayCancelButton(true);
        });
      } else {
        t.innerHTML = 'Edit Schedule';
        setEditingCount(0);
        setEditing(false);
        setDisplayCancelButton(true);
      }
    };
  }

  const cancelEdit = () => {
    if (!window.confirm(`This will discard ${editingCount} change${(editingCount > 1)? 's' : ''}. Are you sure?`)) return;

    setEditing(false);
    const keys: (keyof CourseBlockWeek)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    keys.forEach(k => blocks[k] = blocks[k]?.map(b => ({
      ...b,
      scheduled: b.ronly_scheduled || null,
      opened: false,
      updated: false
    })) || null);
    setBlocks(blocks);
    
    setEditingCount(0);
  }

  return (
    <div style={{display: 'flex'}}>
      <button name="edit-submit" className={`purple button fill ${(editing && displayCancelButton)? 'edit-select' : ''}`} onClick={startOrSave}>
        { (editing && editingCount === 0)?
          'Stop Editing'
          : (editing)?
          `Save ${editingCount} change${(editingCount > 1)? 's' : ''}`
          :
          'Edit Schedule'
        }
      </button>
      { (editing && editingCount > 0 && displayCancelButton)?
        <button name="cancel-edit-submit" className="red button" onClick={cancelEdit}>Cancel</button>
        : <></>
      }
    </div>
  )
}
