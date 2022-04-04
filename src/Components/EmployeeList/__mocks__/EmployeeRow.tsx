import React, { FC } from 'react'
import { Person } from '../../../modules/API'

interface Props {
	employee: Person
  setEmployee: (e: Person) => void
  linkID: number
  genState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const EmployeeRow: FC<Props> = ({employee, setEmployee, linkID, genState}) => {
  return (
    <div>{employee.first_name} {employee.last_name}</div>
  )
}
