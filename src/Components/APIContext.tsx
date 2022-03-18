import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import API, { APIPerson } from '../modules/API'

interface Props {
	children: ReactNode
}

export const contexts = {
  employees: createContext([] as APIPerson[])
}

export const APIContext: FC<Props> = ({children}) => {
  const [employees, setEmployees] = useState([] as APIPerson[])

  useEffect(() => {
    const APIPromises = API.fetchAll();
    APIPromises.employees.then((resp) => {
      setEmployees(resp);
    })
  }, [])

  return (
	  < contexts.employees.Provider value={employees} >
		  {children}
	  </ contexts.employees.Provider>
  )
}

export default APIContext