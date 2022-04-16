import React, { FC } from 'react'

interface Props {
    editingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const EditButton: FC<Props> = ({editingState}) => {
  const [editing, setEditing] = editingState;

  return (
    <button className={`purple button ${editing? 'edit-select' : ''}`} onClick={() => setEditing(!editing)}>
      { editing?
        'Stop Editing'
        : 
        'Edit Schedule'
      }
    </button>
  )
}
