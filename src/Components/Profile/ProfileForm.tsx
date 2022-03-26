import React from 'react'
import { ProfileFormRow } from './ProfileFormRow'

export const ProfileForm = () => {
  const courses = ['110', '121', '221', '222', '312', '313', '314', '315'].map(e => `CSCE ${e}`);

  return (
    <div className="profile-form" >
      <div className="header">
        Courses
      </div>

      <div className="scrollable">
        <div className="hstack">
          <div className="dropdown-label">
            Preferred Number of Lab Sections:  
          </div>
          <input className="fill" type="number" placeholder="2"/>
        </div>
        <div className="hr-container"><hr/></div>

        { courses.map((course: string, idx: number) => (
          <ProfileFormRow element={course} key={`pfrow-${idx}`}/>
        ))}
      </div>

      <div className="hstack">
        <button className="green button submit">Save Qualifications</button>
      </div>
    </div>
  )
}
