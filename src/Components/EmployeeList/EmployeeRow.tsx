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

  const styles = () => {
    let defaults = {
      textDecoration: undefined as undefined | string,
      color: undefined as undefined | string
    }

    if (employee.isScheduled === false) {
      defaults.color = 'red';
    } else if (!checked) {
      defaults.textDecoration = 'line-through';
    }

    return defaults;
  }

  const title = () => {
    if (!checked || employee.isScheduled === false) {
      return 'This user was not scheduled for any labs';
    } else {
      return '';
    }
  }

  return (
    <>
      <div className="hstack">
        <div className="element left">
          {(checked)? 
            <input type="checkbox" title="This peer teacher will be scheduled" checked={true} name="employee-row-checkbox" person-id={linkID} onChange={() => handleCheck(false)}/>
            :
            <input type="checkbox" title="This peer teacher will not be scheduled" checked={false} name="employee-row-checkbox" person-id={linkID} onChange={() => handleCheck(true)}/>
          }
        </div>
        <div title={title()} className="element label" style={styles()}>
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
