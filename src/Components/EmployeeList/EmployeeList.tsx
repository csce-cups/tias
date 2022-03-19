import React, { FC } from 'react'
import { EmployeeRow } from './EmployeeRow'
import { GenerateButton } from './GenerateButton'
import { AcceptButton } from './AcceptButton'
import { APIPerson } from '../../modules/API'
import { contexts } from '../APIContext'

interface Props {
  
}

export const EmployeeList: FC<Props> = () => {
  return (
    <div className="vstack">
      <div className="header">
        <h2 className="slim">Employee</h2>
      </div>

      < contexts.employees.Consumer >
        {employees => (
            (employees.length > 0)?
              <div className="scrollable">
                {employees.map((e: APIPerson, index: number) => (
                  < EmployeeRow key={index} linkID={e.person_id} element={`${e.first_name} ${e.last_name}`} />
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
