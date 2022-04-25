import React, { FC, useContext, useState } from 'react'
import API, { Person } from '../../modules/API'
import edit_icon from '../../assets/edit.svg'
import uuid from '../../uuid'
import contexts from '../APIContext'
import { AdminEmployeeDetail } from './AdminEmployeeDetail'

interface Props {
    employee: Person
    setEmployee: (e: Person | null) => void
}

export const AdminEmployee: FC<Props> = ({employee: employee_super, setEmployee: setEmployee_super}) => {
  const id = uuid();
  const did = uuid();
  const user = useContext(contexts.user);
  const [collapsed, setCollapsed] = useState(true);
  const employeeState = useState<Person>(employee_super);
  const employee = employeeState[0];
  const setEmployee = (e: Person | null) => {
    setEmployee_super(e);
    if (e) employeeState[1](e);
  }

  const [ptcheck, setPtcheck] = useState(employee.peer_teacher);
  const [tacheck, setTacheck] = useState(employee.teaching_assistant);
  const [profcheck, setProfcheck] = useState(employee.professor);
  const [admincheck, setAdmincheck] = useState(employee.administrator);
  const perms = [
    employee.administrator? 'Administrator' : '',
    employee.professor? 'Professor' : '',
    employee.teaching_assistant? 'Teaching Assistant' : '',
    employee.peer_teacher? 'Peer Teacher' : ''
  ];

  const updateUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (user.user?.person_id === employee.person_id && !admincheck) {
      window.alert("You cannot remove your own adminstrator status!");
      return;
    }

    if (admincheck && !employee.administrator) {
      const text = `This action will give ${employee.first_name} ${employee.last_name} administrative privilages over the scheduler. \
They will be able to run the scheduler, promote other users and delete them, and replace semester data. Are you sure you would like to give ${employee.first_name} ${employee.last_name} administrative privilages?`;
      if (!window.confirm(text)) return
    }

    const udpatedUser ={
      ...employee,
      peer_teacher: ptcheck,
      teaching_assistant: tacheck,
      professor: profcheck,
      administrator: admincheck
    }

    const btn = document.getElementById(id);
    
    if (btn !== null) btn.innerHTML = 'Saving...';
    API.updateUser(udpatedUser).then(() => {
      if (btn !== null) btn.innerHTML = 'Done!';
      if (udpatedUser.person_id === user.user?.person_id) alert("You have updated your own roles, please refresh the page to see the changes.");
      setEmployee(udpatedUser);
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred.';
    }).finally(() => {
      setTimeout(() => {
        setCollapsed(true);
      }, 1500);
    });
  }

  const deleteUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}? This action cannot be undone!`)) return;

    const btn = document.getElementById(did);
    
    if (btn !== null) btn.innerHTML = 'Deleting...';
    API.deleteUser(employee.person_id).then(() => {
      if (btn !== null) btn.innerHTML = 'Deleted!';

      setTimeout(() => {
        setCollapsed(true);
      }, 1000);

      setTimeout(() => {
        setEmployee(null);
      }, 1410);
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred.';
    });
  }

  return (
    <div className="employee-row vstack">
      <div className="hstack header" onClick={() => setCollapsed(!collapsed)}>
        <div>{employee.first_name} {employee.last_name} <span className="email">({employee.email})</span></div>
        <div className="fill"/>
        {perms.filter(e => e !== '').join(', ')}
        <div className="mr15"/>
        <img alt="edit" src={edit_icon}/>
      </div>
      <div className={`collapsible${collapsed? ' collapsed' : ' uncollapsed'}`}>
        <div>
          <input id={`admin-check-${JSON.stringify(employee)}-ptcheck`} type="checkbox" checked={ptcheck} onChange={() => setPtcheck(!ptcheck)}/>
          <label htmlFor={`admin-check-${JSON.stringify(employee)}-ptcheck`}>Peer Teacher</label>
        </div>

        <div>
          <input id={`admin-check-${JSON.stringify(employee)}-tacheck`} type="checkbox" checked={tacheck} onChange={() => setTacheck(!tacheck)}/>
          <label htmlFor={`admin-check-${JSON.stringify(employee)}-tacheck`}>Teaching Assistant</label>
        </div>

        <div>
          <input id={`admin-check-${JSON.stringify(employee)}-profcheck`} type="checkbox" checked={profcheck} onChange={() => setProfcheck(!profcheck)}/>
          <label htmlFor={`admin-check-${JSON.stringify(employee)}-profcheck`}>Professor</label>
        </div>

        <div>
          <input id={`admin-check-${JSON.stringify(employee)}-admincheck`} type="checkbox" checked={admincheck} onChange={() => setAdmincheck(!admincheck)}/>
          <label htmlFor={`admin-check-${JSON.stringify(employee)}-admincheck`}>Administrator</label>
        </div>

        <div className="hstack">
          < AdminEmployeeDetail employee={employee}/>
          <button id={id} className="green button fill-restricted" onClick={updateUser}>Update user</button>
          <button id={did} className="red button fill-restricted" onClick={deleteUser}>Delete user</button>
        </div>
      </div>
    </div>
  )
}
