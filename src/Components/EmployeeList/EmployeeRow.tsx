import React, { FC, useState } from 'react'
import { Person } from '../../modules/API'
import { Dot } from '../Misc/Dot'

interface Props {
	employee: Person
  setEmployee: (e: Person) => void
  linkID: number
}

export const EmployeeRow: FC<Props> = ({employee, setEmployee, linkID}) => {
  const [checked, setChecked] = useState<boolean>(employee.isChecked);

  const handleCheck = (setTo: boolean) => {
    setChecked(setTo);
    employee.isChecked = setTo;
    setEmployee(employee);
  }

  return (
    <>
      <div className="hstack">
        <div className="element left">
          {(checked)? 
            <input type="checkbox" checked={true} name="employee-row-checkbox" person-id={linkID} onChange={() => handleCheck(false)}/>
            :
            <input type="checkbox" checked={false} name="employee-row-checkbox" person-id={linkID} onChange={() => handleCheck(true)}/>
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
