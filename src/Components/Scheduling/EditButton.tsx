import React, { FC, useContext } from 'react'
import API from '../../modules/API';
import contexts from '../APIContext';

interface Props {
  editingState: {
    bool: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    count: [number, React.Dispatch<React.SetStateAction<number>>]
  }
}

export const EditButton: FC<Props> = ({editingState}) => {
  const [editing, setEditing] = editingState.bool;
  const [allViable, setAllViable, ] = useContext(contexts.allViableCourses);

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
        t.innerHTML = 'Stop Editing';
      })
    } else setEditing(false);
  }

  return (
    <button className={`purple button ${editing? 'edit-select' : ''}`} onClick={toggleEdit}>
      { editing?
        'Stop Editing'
        : 
        'Edit Schedule'
      }
    </button>
  )
}
