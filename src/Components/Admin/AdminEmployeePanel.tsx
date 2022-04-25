import React, { useContext, useEffect, useState } from 'react'
import API, { Person, Person_INIT } from '../../modules/API';
import uuid from '../../uuid';
import contexts from '../APIContext'
import { Scrollable } from '../Misc/Scrollable';
import { AdminEmployee } from './AdminEmployee';

export const AdminEmployeePanel = () => {
  const rid = uuid();
  const algs = {
    sortLastAlg: ((a: Person, b: Person) => a.last_name.localeCompare(b.last_name)),
    sortFirstAlg: ((a: Person, b: Person) => a.first_name.localeCompare(b.first_name)),
    sortRoleAlg: ((a: Person, b: Person) => {
      if (a.administrator && !b.administrator) return -1;
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
    e.preventDefault();
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
    if (collapsed) document.getElementById('new-user-form-collapsable')?.classList.add('hidden');
    API.fetchEveryone().then(res => {
      setEveryone(res);
    });
  }, [])

  const registerUser = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const elementIds = ['email-register-text', 'fname-register-text', 'lname-register-text'];
    const values = elementIds.map(id => (document.getElementById(id) as HTMLInputElement)?.value);
    const expected = [/.*@tamu\.edu$/, /^[a-zA-Z\s]*$/, /^[a-zA-Z\s]*$/];
    const btn = document.getElementById(rid);

    if (values.some(e => e === '')) {
      btn?.setAttribute('value', 'You must specify a first name, last name, and an email');
      return;
    } else if (values.some((e, i) => !expected[i].test(e))) {
      const wrong = values.findIndex((e, i) => !expected[i].test(e));
      if (wrong === 0) btn?.setAttribute('value', `"${values[wrong]}" is not a valid @tamu.edu email)`);
      else btn?.setAttribute('value', `"${values[wrong]}" is not a valid name`);
      return;
    } else if (formAdminCheck) {
      const text = `This action will give ${values[1]} ${values[2]} administrative privilages over the scheduler. \
They will be able to run the scheduler, promote other users and delete them, and replace semester data. Are you sure you would like to give ${values[1]} ${values[2]} administrative privilages?`;
      if (!window.confirm(text)) return;
    }

    const newUser: Person_INIT = {
      email: values[0],
      firstName: values[1],
      lastName: values[2],
      isPeerTeacher: formPtCheck,
      isTeachingAssistant: formTACheck,
      isProfessor: formProfCheck,
      isAdministrator: formAdminCheck
    }
    
    btn?.setAttribute('value', 'Registering...');
    API.registerNewUser(newUser).then(() => {
      btn?.setAttribute('value', 'Updating list...');
      API.fetchEveryone().then(res => {
        setEmployees(res.filter(e => e.peer_teacher));
        setEveryone(res);
        btn?.setAttribute('value', 'Done!');
      }).catch(() => {
        btn?.setAttribute('value', 'The user was registered, but there was an error updating the list. Please refresh the page.');
      })
      
    }).catch(() => {
      btn?.setAttribute('value', 'An error occurred.');
    });
  }

  const title = {margin: '0', paddingBottom: '2px', borderWidth: '1px'}
  const thinBorder = {borderWidth: '1px'}

  return (
    <div className="vstack panel">
      <div className="inner-content">
        <div className="header hstack" style={title}>
          <h2 className="slim">Employees</h2>
        </div>

        <div className="header-bar" style={thinBorder}>
          <div className="hstack">
            <div className="element left">Sort By:</div>
            <div className="element center" onClick={() => setSortAlg('sortFirstAlg')}>First Name</div>
            <div className="element center" onClick={() => setSortAlg('sortLastAlg')}>Last Name</div>
            <div className="element center" onClick={() => setSortAlg('sortRoleAlg')}>Role</div>
          </div>
        </div>

        <div className={`hstack header witharrow ${collapsed? 'collapsed' : ''}`} onClick={toggleCollapsed}>
          <div className="fill" />
          <div className="header-content">
            <strong>Register New User</strong>
          </div>
          <div className="fill" />
          <div className="arrow-container"/>
        </div>

        <div id="new-user-form-collapsable" className={`collapsible${collapsed? ' collapsed' : ' uncollapsed'}`}>
          <div className="new-user-form hstack">
            <div className="vstack fill">
              <div className="hstack">
                <input id="fname-register-text" type="text" title="A first name must only contain letters" pattern="^[a-zA-Z\s]*$" placeholder="First Name"/>
                <input id="lname-register-text" type="text" title="A last name must only contain letters" pattern="^[a-zA-Z\s]*$" placeholder="Last Name"/>
                <input id="email-register-text" type="text" title="Only a tamu email may be registered" pattern=".*@tamu\.edu$" placeholder="email@tamu.edu"/>
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
            <input onClick={e => registerUser(e)} id={rid} type="submit" className="short green button fill submit" value="Register" style={{padding: '0 5px'}}/>
          </div>
        </div>

        <div className="m5"/>
        
          { (everyone.length > 0)?
            (everyone[0].person_id !== -1)?
              < Scrollable classes={"vstack"} deps={[employees]}>
                { everyone.sort(algs[sortAlg as K]).map((employee, i) => (
                  <AdminEmployee key={JSON.stringify(employee)} employee={employee} setEmployee={(subject: Person | null) => {
                    if (subject === null) {
                      setEmployees(employees.filter(e => e.person_id !== employee.person_id));
                      API.fetchEveryone().then(res => {
                        setEveryone(res);
                      });
                    } else setEmployees(employees.map(e => e.person_id === subject.person_id ? subject : e));
                  }}/>
                ))}
              </Scrollable>
              :
              <div className="loading">Loading...</div>
            :
            <div className="loading">Nothing to show.</div>
          }
      </div>
    </div>
  )
}
