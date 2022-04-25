import React, { FC } from 'react'
import { Person } from '../../../modules/API'

interface Props {
  employee: Person
  setEmployee: (e: Person | null) => void
}

export const AdminEmployee: FC<Props> = ({employee}) => {
  return (
    <div data-testid="AdminEmployee">{employee.first_name} {employee.last_name}</div>
  )
}
