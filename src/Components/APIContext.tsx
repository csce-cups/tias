import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import API, { APIPerson } from '../modules/API'

interface Props {
	children: ReactNode,
  args?: any,
  test?: boolean
}

export const contexts = {
  employees: createContext([] as APIPerson[])
}

export const APIContext: FC<Props> = ({children, args, test}) => {
  const [employees, setEmployees] = useState([] as APIPerson[])

  useEffect(() => {
    const APIPromises = (test)? API.fetchAllDummy() : API.fetchAll();
    APIPromises.employees.then((resp) => {
      setEmployees(resp);
    })
    // eslint-disable-next-line
  }, []); // The empty array is so that this effect is ran only on render and not on "test" update.

  return (
	  < contexts.employees.Provider value={employees} >
		  {children}
	  </ contexts.employees.Provider>
  )
}

export default APIContext