import React, { useContext, useState } from 'react'
import { Person } from '../../modules/API';
import uuid from '../../uuid';
import contexts from '../APIContext'
import { AdminEmployee } from './AdminEmployee';

export const AdminEmployeePanel = () => {
  const rid = uuid();
  const sortLastAlg = ((a: Person, b: Person) => a.last_name.localeCompare(b.last_name));
  const sortFirstAlg = ((a: Person, b: Person) => a.first_name.localeCompare(b.first_name));
  const [employees, setEmployees] = useContext(contexts.employees);
  const [sortLast, setSortLast] = useState(true);
  const [collapsed, setCollapsed] = useState(true);

  const registerUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.error("REGISTER USER NOT IMPLEMENTED");

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
            <div className="element center" onClick={() => setSortLast(false)}>First Name</div>
            <div className="element center" onClick={() => setSortLast(true)}>Last Name</div>
          </div>
        </div>

        <button className="blue button short" onClick={() => setCollapsed(!collapsed)}>Register New User</button>
        <div className={`collapsible${collapsed? ' collapsed' : ' uncollapsed'}`}>
          <div className="new-user-form">
            <input type="text" placeholder="email@tamu.edu"/>
            <button id={rid} className="short green button" onClick={registerUser} style={{padding: '0 5px'}}>Register</button>
          </div>
        </div>

        <div style={{margin: '5px'}}/>
        
        <div className="scrollable vstack">
          { employees.sort((sortLast)? sortLastAlg : sortFirstAlg).map(employee => (
            <AdminEmployee key={employee.person_id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  )
}
