import React, { FC, useContext, useState } from 'react'
import { Person } from '../../modules/API'
import edit_icon from '../../assets/edit.svg'
import uuid from '../../uuid'
import contexts from '../APIContext'

interface Props {
    employee: Person
}

export const AdminEmployee: FC<Props> = ({employee}) => {
  const id = uuid();
  const did = uuid();
  const tid = uuid();
  const user = useContext(contexts.user);
  const [collapsed, setCollapsed] = useState(true);

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
    console.error("UPDATE USER NOT IMPLEMENTED");

    if (user.user?.person_id === employee.person_id && !admincheck) {
      window.alert("You cannot remove your own adminstrator status!");
      return;
    }

    if (admincheck && !employee.administrator) {
      const text = `This action will give ${employee.first_name} ${employee.last_name} administrative privilages over the scheduler. \
They will be able to run the scheduler, promote other users and delete them, and replace semester data. Are you sure you would like to give ${employee.first_name} ${employee.last_name} administrative privilages?`;
      if (!window.confirm(text)) return
    }

    console.log({
      ...employee,
      peer_teacher: ptcheck,
      teaching_assistant: tacheck,
      professor: profcheck,
      administrator: admincheck
    })

    const btn = document.getElementById(id);
    
    if (btn !== null) btn.innerHTML = 'Saving...';
    setTimeout(() => {
      // if (btn !== null) btn.innerHTML = 'Done!';
      if (btn !== null) btn.innerHTML = 'Not Implemented!';

      setTimeout(() => {
        setCollapsed(true);
      }, 1500);
    }, 2000);
  }

  const deleteUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.error("DELETE USER NOT IMPLEMENTED");
    if (!window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}? This action cannot be undone!`)) return;

    const btn = document.getElementById(did);
    
    if (btn !== null) btn.innerHTML = 'Deleting...';
    setTimeout(() => {
      // if (btn !== null) btn.innerHTML = 'Done!';
      if (btn !== null) btn.innerHTML = 'Not Implemented!';

      setTimeout(() => {
        setCollapsed(true);
      }, 1500);
    }, 2000);
  }

  return (
    <div className="employee-row vstack">
      <div className="hstack header" onClick={() => setCollapsed(!collapsed)}>
        <div>{employee.first_name} {employee.last_name}</div>
        <div className="fill"/>
        {perms.filter(e => e !== '').join(', ')}
        <div style={{marginRight: '15px'}}/>
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
          <button id={id} className="green button fill" onClick={updateUser}>Update user</button>
          <button id={did} className="red button fill" onClick={deleteUser}>Delete user</button>
        </div>

        <div className="hstack">
          <button id={tid} className="blue button fill" style={{marginTop: '0'}}>View Trades</button>
        </div>
      </div>
    </div>
  )
}
