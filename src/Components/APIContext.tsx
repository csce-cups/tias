import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import API, { APIPerson } from '../modules/API'

interface Props {
	children: ReactNode,
  args?: any
}

export const contexts = {
  employees: createContext([] as APIPerson[])
}

export const APIContext: FC<Props> = ({children, args}) => {
  const [employees, setEmployees] = useState([] as APIPerson[])

  useEffect(() => {
    const APIPromises = API.fetchAllDummy({employees: args?.employees});
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