import React from 'react'
import { ProfileFormRow } from './ProfileFormRow'
import { contexts } from '../APIContext'
import { APIUserQualification } from '../../modules/API';

export const ProfileForm = () => {
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

        < contexts.userQuals.Consumer >
          { (quals) => (
            quals.map((qual: APIUserQualification, idx: number) => (
              <ProfileFormRow course={qual.course_id} qual={qual.qualified} key={`pfrow-${idx}`}/>
            ))
          )}
        </contexts.userQuals.Consumer>
      </div>

      <div className="hstack">
        <button className="green button submit">Save Qualifications</button>
      </div>
    </div>
  )
}
