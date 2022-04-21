import React, { FC } from 'react'
import { Person } from '../../../modules/API'

interface Props {
	employee: Person
  setEmployee: (e: Person) => void
  linkID: number
  genState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const EmployeeRow: FC<Props> = ({employee}) => {
  return (
    <>
      <input type="checkbox" checked={true} onChange={() => {}} name="employee-row-checkbox" person-id={employee.person_id}/>
      <div data-testid="EmployeeRow">{employee.first_name} {employee.last_name}</div>
    </>
  )
}
