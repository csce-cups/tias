import React, { FC, useState } from 'react'
import { Person } from '../../modules/API'
import { Dot } from '../Misc/Dot'

interface Props {
	employee: Person
  linkID: number
}

export const EmployeeRow: FC<Props> = ({employee, linkID}) => {
  return (
    <div className="employee-row">
      <div className="hstack">
        <div className="element left">
          <input type="checkbox"/>
        </div>
        <div className="element label">
         {employee.first_name} {employee.last_name}
        </div>
        <div className="element right">
          < Dot isScheduled={employee.isScheduled} linkID={linkID} />
        </div>
      </div>
      <div className="divider"/>
    </div>
  )
}
