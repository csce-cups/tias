import React, { useContext } from 'react'
import contexts from '../APIContext'

export const AdminEmployeePanel = () => {
  const [employees, setEmployees] = useContext(contexts.employees);

  return (
    <div className="vstack panel">
      <h2 className="panel-title">Employees</h2>
      <div className='scrollable'>
        { employees.map(employee => (
          <div>{employee.first_name} {employee.last_name}</div>
        ))}
      </div>
    </div>
  )
}
