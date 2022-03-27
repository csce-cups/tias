import React, { FC, useState } from 'react'

interface Props {
	course: string // The body of the list element
  qual: boolean
}

export const ProfileFormRow : FC<Props> = ({course, qual}) => {
  const [qualified, setQualified] = useState(qual);

  const update = () => {
    const e = document.getElementById(`${course}-prefs`)! as HTMLSelectElement
    setQualified(e.value === 'true');
  }

  if (course === 'loading') {
    return (
      <div className="hstack form-row">
        <div className="center element loading" style={{margin: '5vh 0 10vh 0'}}>Loading your saved qualifications...</div>
      </div>
    )
  } else if (course === 'none') {
    return (
      <div className="hstack form-row">
        <div className="center element loading" style={{margin: '5vh 0 10vh 0'}}>Nothing to display</div>
      </div>
    )
  }

  return (
    <>
      <div className="hstack form-row">
        <div className="element">
          CSCE {course}
        </div>
        <div className="fill">
          <select id={`${course}-prefs`} defaultValue={`${qualified}`} for-course={course} onChange={update}>
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