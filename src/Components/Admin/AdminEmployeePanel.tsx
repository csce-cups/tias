import React, { useContext, useState } from 'react'
import { Person } from '../../modules/API';
import contexts from '../APIContext'
import { AdminEmployee } from './AdminEmployee';

export const AdminEmployeePanel = () => {
  const sortLastAlg = ((a: Person, b: Person) => a.last_name.localeCompare(b.last_name));
  const sortFirstAlg = ((a: Person, b: Person) => a.first_name.localeCompare(b.first_name));
  const [employees, setEmployees] = useContext(contexts.employees);
  const [sortLast, setSortLast] = useState(true);

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

        <button className="green button short">Register New User</button>

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
