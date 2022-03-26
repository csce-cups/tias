import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import API, { APIPerson, APICourseBlockWeek, APIUserQualification } from '../modules/API'

interface Props {
	children: ReactNode,
  args?: any,
  test?: boolean
}

export const contexts = {
  employees: createContext([] as APIPerson[]),
  blocks: createContext({Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as APICourseBlockWeek),
  userQuals: createContext([{course_id: "loading", qualified: false}] as APIUserQualification[])
}

export const APIContext: FC<Props> = ({children, args, test}) => {
  const [employees, setEmployees] = useState([] as APIPerson[]);
  const [blocks, setBlocks] = useState({Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as APICourseBlockWeek);
  const [userQuals, setUserQuals] = useState([{course_id: "loading", qualified: false}] as APIUserQualification[]);

  useEffect(() => {
    const APIPromises = (test)? API.fetchAllDummy() : API.fetchAll();
    APIPromises.employees.then((resp) => {
      setEmployees(resp);
    });

    APIPromises.blocks.then((resp) => {
      setBlocks(resp);
    });

    APIPromises.userQuals.then((resp) => {
      setUserQuals(resp);
    });

    // eslint-disable-next-line
  }, []); // The empty array is so that this effect is ran only on render and not on "test" update.

  return (
	  < contexts.employees.Provider value={employees} >
      < contexts.blocks.Provider value={blocks} >
        < contexts.userQuals.Provider value={userQuals} >
		      {children}
        </contexts.userQuals.Provider>
      </contexts.blocks.Provider>
	  </ contexts.employees.Provider>
  )
}

export default APIContext