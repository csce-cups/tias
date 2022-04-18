import React, { FC, useContext } from 'react'
import API, { CourseBlock, CourseBlockWeek } from '../../modules/API';
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

  const fetchValidEmployees = () => {
    if (allViable.size === 0) {
      return API.fetchAllViableCourses().then(res => {
        setAllViable(res);
      });
    } else return new Promise<void>(r => r());
  }

  const toggleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const t = e.currentTarget
    t.innerHTML = !editing ? 'Loading...' : 'Edit Schedule';
    if (!editing) {
      fetchValidEmployees().then(() => {
        setEditing(true);
        console.log(editingCount)
        t.innerHTML = 'Stop Editing';
      })
    } else {
      setEditing(false);
      const keys: (keyof CourseBlockWeek)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      keys.forEach(k => blocks[k] = blocks[k]?.map(b => ({
        ...b,
        scheduled: b.ronly_scheduled || null,
        opened: false,
        updated: false
      })) || null);
      setBlocks(blocks);
    };
    
    setEditingCount(0);
  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
      <button name="edit-submit" className={`purple button fill ${editing? 'edit-select' : ''}`} onClick={toggleEdit}>
        { (editing && editingCount === 0)?
          'Stop Editing'
          : (editing)?
          `Save ${editingCount} change${(editingCount > 1)? 's' : ''}`
          :
          'Edit Schedule'
        }
      </button>
      { (editing && editingCount > 0)?
        <button name="cancel-edit-submit" className="red button" onClick={cancelEdit}>Cancel</button>
        : <></>
      }
    </div>
  )
}
