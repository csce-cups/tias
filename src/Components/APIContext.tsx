import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import API, { APIPerson, APICourseBlockWeek } from '../modules/API'

interface Props {
	children: ReactNode,
  args?: any,
  test?: boolean
}

export const contexts = {
  employees: createContext([] as APIPerson[]),
  blocks: createContext({Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []} as APICourseBlockWeek)
}

export const APIContext: FC<Props> = ({children, args, test}) => {
  const [employees, setEmployees] = useState([] as APIPerson[]);
  const [blocks, setBlocks] = useState({Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []} as APICourseBlockWeek);

  useEffect(() => {
    const APIPromises = (test)? API.fetchAllDummy() : API.fetchAll();
    APIPromises.employees.then((resp) => {
      setEmployees(resp);
    });

    APIPromises.blocks.then((resp) => {
      console.log(resp);
      setBlocks(resp);
    });

    // eslint-disable-next-line
  }, []); // The empty array is so that this effect is ran only on render and not on "test" update.

  return (
	  < contexts.employees.Provider value={employees} >
      < contexts.blocks.Provider value={blocks} >
		    {children}
      </contexts.blocks.Provider>
	  </ contexts.employees.Provider>
  )
}

export default APIContext