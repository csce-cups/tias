import React, { FC, useState } from 'react'
import { Person } from '../../modules/API'
import uuid from '../../uuid'
import { Dot } from '../Misc/Dot'

interface Props {
	employee: Person
  setEmployee: (e: Person) => void
  linkID: number
}

export const EmployeeRow: FC<Props> = ({employee, setEmployee, linkID}) => {
  const [checked, setChecked] = useState<boolean>(employee.isChecked);
  const id = uuid();

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
    if (!checked && employee.isScheduled !== false) {
      return 'This peer teacher will not be scheduled for any labs';
    } else if (employee.isScheduled === false) {
      return 'This peer teacher was not scheduled for any labs';
    } else if (employee.isScheduled !== true) {
      return 'This peer teacher may be scheduled to labs';
    } else return '';
  }

  return (
    <>
      <div className="hstack">
        <div className="element left">
          {(checked)? 
            <input id={id} type="checkbox" title="This peer teacher will be scheduled" checked={true} name="employee-row-checkbox" person-id={linkID} onChange={() => handleCheck(false)}/>
            :
            <input id={id} type="checkbox" title="This peer teacher will not be scheduled" checked={false} name="employee-row-checkbox" person-id={linkID} onChange={() => handleCheck(true)}/>
          }
        </div>
        <label htmlFor={id} title={title()} className="element label" style={styles()}>
         {employee.first_name} {employee.last_name}
        </label>
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
