import React, { FC, useContext, useState } from 'react'
import { EmployeeRow } from './EmployeeRow'
import { GenerateButton } from './GenerateButton'
import { AcceptButton } from './AcceptButton'
import { Person } from '../../modules/API'
import contexts from '../APIContext'

interface Props {
  
}

export const EmployeeList: FC<Props> = () => {
  const sortLastAlg = ((a: Person, b: Person) => a.last_name.localeCompare(b.last_name));
  const sortFirstAlg = ((a: Person, b: Person) => a.first_name.localeCompare(b.first_name));
  const [employees, setEmployees] = useContext(contexts.employees);
  const notScheduled = employees.filter(e => e.isScheduled === false).length;

  const [sortLast, setSortLast] = useState<boolean>(true);

  return (
    <div className="vstack">
      <div className="header hstack" style={{marginBottom: '0'}}>
        <h2 className="slim">Peer Teachers</h2>
      </div>

      <div className="header-bar">
        <div className="hstack">
          <div className="element left">Sort By:</div>
          <div className="element center" onClick={() => setSortLast(false)}>First Name</div>
          <div className="element center" onClick={() => setSortLast(true)}>Last Name</div>
        </div>
      </div>

      {(notScheduled > 0)? 
          <div className='header-bar'>
            <div title={`${notScheduled} peer teacher${(notScheduled > 1)? 's weren\'t' : ' wasn\'t'} scheduled`} className="slim unscheduled">{notScheduled} unscheduled peer teachers</div>
          </div>
          :
          <></>
        }


      {(employees.length > 0)?
          <div className="scrollable">
            {employees.sort((sortLast)? sortLastAlg : sortFirstAlg).map((e: Person, index: number) => (
              < EmployeeRow employee={employees[index]} setEmployee={(e: Person) => {
                employees[index] = e;
                setEmployees(employees);
              }} key={index} linkID={e.person_id} />
            ))}
          </div>

        : <div className="loading">Loading...</div>
      }

      <div className="vstack top-border">
        < GenerateButton />
        < AcceptButton />
      </div>
    </div>
  )
}
