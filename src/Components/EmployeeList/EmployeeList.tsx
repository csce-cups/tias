import React, { FC, useState } from 'react'
import { EmployeeRow } from './EmployeeRow'
import { GenerateButton } from './GenerateButton'
import { AcceptButton } from './AcceptButton'
import { Person } from '../../modules/API'
import contexts from '../APIContext'

interface Props {
  
}

export const EmployeeList: FC<Props> = () => {
  const sortLastAlg = ((a: Person, b: Person) => a.last_name.localeCompare(b.last_name));
  const sortFirstAlg = ((a: Person, b: Person) => a.first_name.localeCompare(b.first_name));;
  const [sortLast, setSortLast] = useState<boolean>(true);

  return (
    <div className="vstack">
      <div className="header" style={{marginBottom: '0'}}>
        <h2 className="slim">Peer Teachers</h2>
      </div>

      <div className="sorter">
        <div className="hstack">
          <div className="element left">Sort By:</div>
          <div className="element right" onClick={() => setSortLast(false)}>First Name</div>
          <div className="element right" onClick={() => setSortLast(true)}>Last Name</div>
        </div>
      </div>

      < contexts.employees.Consumer >
        {([employees, setEmployees]) => (
            (employees.length > 0)?
              <div className="scrollable">
                {employees.sort((sortLast)? sortLastAlg : sortFirstAlg).map((e: Person, index: number) => (
                  < EmployeeRow employee={employees[index]} setEmployee={(e: Person) => {
                    employees[index] = e;
                    setEmployees(employees);
                  }} key={index} linkID={e.person_id} />
                ))}
              </div>

            : <div className="loading">Loading...</div>
        )}
      </contexts.employees.Consumer>

      <div className="vstack top-border">
        < GenerateButton />
        < AcceptButton />
      </div>
    </div>
  )
}
