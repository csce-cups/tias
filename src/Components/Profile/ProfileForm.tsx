import React, { useEffect } from 'react'
import { ProfileFormRow } from './ProfileFormRow'
import { contexts } from '../APIContext'
import { APIUserQualification, parseCookie } from '../../modules/API';

export const ProfileForm = () => {
  let updateOnDismount = () => {};
  const submit = (event: any, setQuals: any) => {
    const selections = Array.from(document.querySelectorAll(`select[id$="-prefs"]`));
    let newQuals: APIUserQualification[] = [];
    let requestBody: any = {"qualifications": {}}
    selections.forEach((dropdown) => {
      const e = dropdown as HTMLSelectElement;
      newQuals.push({
        course_id: e.getAttribute('for-course')!,
        qualified: e.value === "true"
      })

      requestBody.qualifications[e.getAttribute('for-course')!] = e.value === "true";
    })

    document.getElementById("submit-button")?.setAttribute('value', 'Saving...');
    fetch(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${parseCookie().tias_user_id}/qualifications`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }).then(response => response.json())
      .then(responseJSON => {
        document.getElementById("submit-button")?.setAttribute('value', 'Qualifications Saved!');
        console.log(responseJSON)
    }).catch(() => {
      document.getElementById("submit-button")?.setAttribute('value', 'Qualifiactions could not be saved.');
    });
    
    updateOnDismount = () => setQuals(newQuals);

    event.preventDefault();
  }

  useEffect(() => {
    return () => updateOnDismount();
  }, [])

  return (
    <div className="profile-form" >
      <div className="header">
        Courses
      </div>

      < contexts.userQuals.Consumer >
        {([quals, setQuals]) => (
          <form onSubmit={(e: any) => submit(e, setQuals)}>
            <div className="scrollable">
              <div className="hstack">
                <div className="dropdown-label">
                  Preferred Number of Lab Sections:  
                </div>
                <input className="fill" type="number" placeholder="2"/>
              </div>
              <div className="hr-container"><hr/></div>

              { (quals.length > 0)? 
                quals.map((qual: APIUserQualification, idx: number) => (
                  <ProfileFormRow course={qual.course_id} qual={qual.qualified} key={`pfrow-${idx}`}/>
                ))
                :
                <ProfileFormRow course={"none"} qual={false} key={`pfrow-none`}/>
              }
            </div>

            <div className="hstack">
              <input id="submit-button" type="submit" className="green button submit" value="Save Qualifications"/>
            </div>
          </form>
        )}
      </contexts.userQuals.Consumer>
    </div>
  )
}
