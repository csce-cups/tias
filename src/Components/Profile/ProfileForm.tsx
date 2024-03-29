import React, { useContext, useState } from 'react';
import API, { APIUserQualification } from '../../modules/API';
import contexts from '../APIContext';
import { ProfileFormRow } from './ProfileFormRow';

export const ProfileForm = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [userViableCourses, setUserViableCourses] = useContext(contexts.userViableCourses); 
  const user = useContext(contexts.user);

  const submit = (event: any, setQuals: any) => {
    const selections = Array.from(document.querySelectorAll(`select[id$="-prefs"]`));
    let newQuals: APIUserQualification[] = [];
    let requestBody: any = {};
    selections.forEach((dropdown) => {
      const e = dropdown as HTMLSelectElement;
      newQuals.push({
        course_id: parseInt(e.getAttribute('for-cid')!),
        course_number: e.getAttribute('for-course')!,
        qualified: e.value === "true"
      })

      requestBody[e.getAttribute('for-cid')!] = e.value === "true";
    })

    document.getElementById("submit-button")?.setAttribute('value', 'Saving...');
    API.sendUserQualifications(requestBody, user.user?.person_id).then(responseJSON => {
      if (responseJSON.message !== undefined && responseJSON.message.contains('error')) {
        document.getElementById("submit-button")?.setAttribute('value', 'Qualifications could not be saved.')
      } else {
        document.getElementById("submit-button")?.setAttribute('value', 'Updating Preferences...');
        API.fetchUserViableCourses(user.user?.person_id).then((resp) => {
          setQuals(newQuals);
          setUserViableCourses(resp);
          document.getElementById("submit-button")?.setAttribute('value', 'Qualifications Saved!');
        })
      }
    }).catch(() => document.getElementById("submit-button")?.setAttribute('value', 'Qualifications could not be saved.'));

    event.preventDefault();
  }

  return (
    <div className={`profile-form ${collapsed? 'collapsed' : ''}`} >
      <div className={`hstack header ${collapsed? 'collapsed' : ''}`} onClick={() => setCollapsed(!collapsed)}>
        <div className="header-content">Course Qualifications</div>
        <div className="fill" />
        <div className="arrow-container"/>
      </div>

      < contexts.userQuals.Consumer >
        {([quals, setQuals]) => (
          <div className={`${collapsed? "collapsed " : ""}form-body`}>
            <form onSubmit={(e) => submit(e, setQuals)}>
              { (quals.length > 0)? 
                quals.map((qual: APIUserQualification, idx: number) => (
                  <ProfileFormRow course_id={qual.course_id} course_name={qual.course_number} qual={qual.qualified} key={`pfrow-${JSON.stringify(qual)}`}/>
                ))
                :
                <ProfileFormRow course_id={-1} course_name={"none"} qual={false} key={`pfrow-none`}/>
              }

              <div className="hstack">
                <input id="submit-button" type="submit" className="green button submit" value="Save Qualifications"/>
              </div>
            </form>
          </div>
        )}
      </contexts.userQuals.Consumer>
    </div>
  )
}
