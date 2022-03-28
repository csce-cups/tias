import React, { FC, useState } from 'react'
import { APIPerson } from '../../modules/API'
import { Dot } from '../Misc/Dot'

interface Props {
	employee: APIPerson
  linkID: number
}

export const EmployeeRow: FC<Props> = ({employee, linkID}) => {
  employee.isScheduled = useState<null| boolean>(null)
  return (
    <>
      <div className="hstack">
        <div className="element left">
          <input type="checkbox"/>
        </div>
        <div className="element label">
         {employee.first_name} {employee.last_name}
        </div>
        <div className="element right">
          < Dot isScheduled={employee.isScheduled![0]} linkID={linkID} />
        </div>
      </div>
      <div className="hr-container">
        <hr/>
      </div>
    </>
  )
}
