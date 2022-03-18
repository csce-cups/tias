import React, { FC } from 'react'
import { EmployeeRow } from './EmployeeRow'
import { GenerateButton } from './GenerateButton'
import { AcceptButton } from './AcceptButton'
import { APIPerson } from '../../modules/API'
import { Store } from 'state-pool'

interface Props {
  APIData: Store
}

export const EmployeeList: FC<Props> = ({APIData}) => {
  const [data]: [APIPerson[] | string[], ...any] = APIData.useState("employees");
  return (
    <div className="vstack">
      <div className="header">
        <h2 className="slim">Employee</h2>
      </div>

      {(data.length > 0)?
        <div className="scrollable">
          {data.map((e: APIPerson | string, index: number) => (
            (typeof e === 'string')? 
              < EmployeeRow key={index} linkID={index} element={e} />
            : < EmployeeRow key={index} linkID={e.person_id} element={`${e.first_name} ${e.last_name}`} />
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
