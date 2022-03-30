import React, { FC, useState } from 'react'
import { APIPerson } from '../../modules/API'
import { Dot } from '../Misc/Dot'

interface Props {
	employee: APIPerson
  linkID: number
}

export const EmployeeRow: FC<Props> = ({employee, linkID}) => {
  const [checked, setChecked] = useState<boolean>(true);
  return (
    <>
      <div className="hstack">
        <div className="element left">
          {(checked)? 
            <input type="checkbox" checked={true} name="employee-row-checkbox" person-id={linkID} onChange={() => setChecked(false)}/>
            :
            <input type="checkbox" checked={false} name="employee-row-checkbox" person-id={linkID} onChange={() => setChecked(true)}/>
          }
        </div>
        <div className="element label">
         {employee.first_name} {employee.last_name}
        </div>
        <div className="element right">
          < Dot isScheduled={employee.isScheduled} linkID={linkID} />
        </div>
      </div>
      <div className="hr-container">
        <hr/>
      </div>
    </>
  )
}
