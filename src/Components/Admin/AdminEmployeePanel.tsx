import React, { useContext, useState } from 'react'
import { Person, Person_INIT } from '../../modules/API';
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
  const [sortAlg, setSortAlg] = useState<string>('sortLastAlg');
  const [collapsed, setCollapsed] = useState(true);

  const registerUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.error("REGISTER USER NOT IMPLEMENTED");

    const newUser: Person_INIT = {
      email: '',
      firstName: '',
      lastName: '',
      isPeerTeacher: false,
      isTeachingAssistant: false,
      isProfessor: false,
      isAdministrator: false,
    }

    const btn = document.getElementById(rid);
    
    if (btn !== null) btn.innerHTML = 'Registering...';
    setTimeout(() => {
      // if (btn !== null) btn.innerHTML = 'Done!';
      if (btn !== null) btn.innerHTML = 'Not Implemented!';
    }, 2000);
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

        <button className="blue button short" onClick={() => setCollapsed(!collapsed)}>Register New User</button>
        <div className={`collapsible${collapsed? ' collapsed' : ' uncollapsed'}`}>
          <div className="new-user-form">
            <input type="text" placeholder="First Name"/>
            <input type="text" placeholder="Last Name"/>
            <input type="text" placeholder="email@tamu.edu"/>
            <button id={rid} className="short green button" onClick={registerUser} style={{padding: '0 5px'}}>Register</button>
          </div>
        </div>

        <div style={{margin: '5px'}}/>
        
        <div className="scrollable vstack">
          { employees.sort(algs[sortAlg as K]).map((employee, i) => (
            <AdminEmployee key={JSON.stringify(employee)} employee={employee} setEmployee={(e: Person) => {
              employees[i] = e;
              setEmployees(employees);
            }}/>
          ))}
        </div>
      </div>
    </div>
  )
}
