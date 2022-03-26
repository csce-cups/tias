import React, { FC, useState } from 'react'


interface Props {
	element: string // The body of the list element
}

export const ProfileFormRow : FC<Props> = ({element}) => {
  const elementJoined = element.replace(/ /g, '-');
  const [qualified, setQualified] = useState(false);
  const update = () => {
    const e = document.getElementById(`${elementJoined}-prefs`)! as HTMLSelectElement
    setQualified(e.value === 'true');
  }

  return (
  <>
    <div className="hstack form-row">
      <div className="element">
        {element}
      </div>
      <div className="fill">
        <select id={`${elementJoined}-prefs`} name="prefs" onChange={update}>
          <option value="false">Not Qualified to Teach</option>
          <option value="true">Qualified to Teach</option>
        </select>
      </div>
      <div className="status">
        { qualified? 
          <div className="success">Can be scheduled for this course</div>
          :
          <div className="fail">Will not be scheduled for this course</div>
        }
      </div>
    </div>
    <div className="hr-container"><hr/></div>
  </>
  )
}