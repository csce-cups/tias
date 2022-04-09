import React, { useContext, useEffect, useState } from 'react'
import API, { Person, Person_INIT } from '../../modules/API';
import uuid from '../../uuid';
import contexts from '../APIContext'
import { AdminEmployee } from './AdminEmployee';

export const AdminEmployeePanel = () => {
  const rid = uuid();
  const algs = {
    sortLastAlg: ((a: Person, b: Person) => a.last_name.localeCompare(b.last_name)),
    sortFirstAlg: ((a: Person, b: Person) => a.first_name.localeCompare(b.first_name)),
    sortRoleAlg: ((a: Person, b: Person) => {
      if (a && !b) return -1;
      else if (!a && b) return 1;
      else if (!a && !b) return 0;
      else if (a.administrator && !b.administrator) return -1;
      else if (!a.administrator && b.administrator) return 1;
      else if (a.professor && !b.professor) return -1;
      else if (!a.professor && b.professor) return 1;
      else if (a.teaching_assistant && !b.teaching_assistant) return -1;
      else if (!a.teaching_assistant && b.teaching_assistant) return 1;
      else if (a.peer_teacher && !b.peer_teacher) return -1;
      else if (!a.peer_teacher && b.peer_teacher) return 1;
      else return a.last_name.localeCompare(b.last_name);
    })
  }
  type K = keyof typeof algs;

  const [employees, setEmployees] = useContext(contexts.employees);
  const [everyone, setEveryone] = useState([{person_id: -1}] as Person[]);
  const [sortAlg, setSortAlg] = useState<string>('sortLastAlg');
  const [collapsed, setCollapsed] = useState(true);

  const [formPtCheck, setFormPtCheck] = useState<boolean>(false);
  const [formTACheck, setFormTACheck] = useState<boolean>(false);
  const [formProfCheck, setFormProfCheck] = useState<boolean>(false);
  const [formAdminCheck, setFormAdminCheck] = useState<boolean>(false);

  const toggleCollapsed = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const btn = document.getElementById(rid);
    if (btn !== null) btn.innerHTML = "Register";

    if (collapsed) document.getElementById('new-user-form-collapsable')?.classList.remove('hidden');
    else setTimeout(() => {
      document.getElementById('new-user-form-collapsable')?.classList.add('hidden');
    }, 500);

    setTimeout(() => { // For animation's sake, we add the tiniest delay to toggling
      setCollapsed(!collapsed);
    }, 1);
  }


  useEffect(() => {
    document.getElementById('new-user-form-collapsable')?.classList.add('hidden');
    API.fetchEveryone().then(res => {
      setEveryone(res);
    });
  }, [])

  const registerUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const elementIds = ['email-register-text', 'fname-register-text', 'lname-register-text',
      'pt-register-checkbox', 'ta-register-checkbox', 'prof-register-checkbox', 'admin-register-checkbox'];
    const elements = elementIds.map(id => document.getElementById(id) as HTMLInputElement);
    const btn = document.getElementById(rid);

    if (elements.splice(0, 3).some(e => e.value === '')) {
      if (btn !== null) btn.innerHTML = 'You must specify a first name, last name, and an email';
    }

    const newUser: Person_INIT = {
      email: elements[0].value,
      firstName: elements[1].value,
      lastName: elements[2].value,
      isPeerTeacher: elements[3].checked,
      isTeachingAssistant: elements[4].checked,
      isProfessor: elements[5].checked,
      isAdministrator: elements[6].checked
    }
    
    if (btn !== null) btn.innerHTML = 'Registering...';
    API.registerNewUser(newUser).then(() => {
      if (btn !== null) btn.innerHTML = 'Updating list...';
      API.fetchEveryone().then(res => {
        setEmployees(res.filter(e => e.peer_teacher));
        setEveryone(res);
        if (btn !== null) btn.innerHTML = 'Done!';
      }).catch(() => {
        if (btn !== null) btn.innerHTML = 'The user was registered, but there was an error updating the list. Please refresh the page.';
      })
      
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred.';
    });
  }

  return (
    <div className="vstack panel">
      <div className="inner-content">
        <div className="header hstack" style={{margin: '0', paddingBottom: '2px', borderWidth: '1px'}}>
          <h2 className="slim">Employees</h2>
        </div>

        <div className="header-bar" style={{borderWidth: '1px'}}>
          <div className="hstack">
            <div className="element left">Sort By:</div>
            <div className="element center" onClick={() => setSortAlg('sortFirstAlg')}>First Name</div>
            <div className="element center" onClick={() => setSortAlg('sortLastAlg')}>Last Name</div>
            <div className="element center" onClick={() => setSortAlg('sortRoleAlg')}>Role</div>
          </div>
        </div>

        <div className={`hstack header witharrow ${collapsed? 'collapsed' : ''}`} onClick={toggleCollapsed}>
          <div className="header-content">Register New User</div>
          <div className="fill" />
          <div className="arrow-container"/>
        </div>

        <div id="new-user-form-collapsable" className={`collapsible${collapsed? ' collapsed' : ' uncollapsed'}`}>
          <div className="new-user-form hstack">
            <div className="vstack fill">
              <div className="hstack">
                <input id="fname-register-text" type="text" pattern="/^[a-zA-Z\s]*$/" placeholder="First Name"/>
                <input id="lname-register-text" type="text" pattern="/^[a-zA-Z\s]*$/" placeholder="Last Name"/>
                <input id="email-register-text" type="text" pattern="/*.@tamu.edu" placeholder="email@tamu.edu"/>
              </div>
              <div className='hstack'>
                <div className="fill">
                  <input id="pt-register-checkbox" type="checkbox" checked={formPtCheck} onChange={() => setFormPtCheck(!formPtCheck)}/>
                  <label htmlFor="pt-register-checkbox">Peer Teacher</label>
                </div>
                <div className="fill">
                  <input id="ta-register-checkbox" type="checkbox" checked={formTACheck} onChange={() => setFormTACheck(!formTACheck)}/>
                  <label htmlFor="ta-register-checkbox">Teaching Assistant</label>
                </div>
                <div className="fill">
                  <input id="prof-register-checkbox" type="checkbox" checked={formProfCheck} onChange={() => setFormProfCheck(!formProfCheck)}/>
                  <label htmlFor="prof-register-checkbox">Professor</label>
                </div>
                <div className="fill">
                  <input id="admin-register-checkbox" type="checkbox" checked={formAdminCheck} onChange={() => setFormAdminCheck(!formAdminCheck)}/>
                  <label htmlFor="admin-register-checkbox">Administrator</label>
                </div>
              </div>
            </div>
          </div>
          <div className="hstack">
            <button id={rid} className="short green button fill" onClick={registerUser} style={{padding: '0 5px'}}>Register</button>
          </div>
        </div>

        <div style={{margin: '5px'}}/>
        
        <div className="scrollable vstack">
          { (everyone.length > 0)?
            (everyone[0].person_id !== -1)?
              everyone.sort(algs[sortAlg as K]).map((employee, i) => (
                <AdminEmployee key={JSON.stringify(employee)} employee={employee} setEmployee={(subject: Person) => {
                  setEmployees(employees.map(e => e.person_id === subject.person_id ? subject : e));
                }}/>
              ))
              :
              <div className="loading">Loading...</div>
            :
            <div className="loading">Nothing to show.</div>
          }
        </div>
      </div>
    </div>
  )
}
