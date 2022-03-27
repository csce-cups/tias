import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import API, { APIPerson, APICourseBlockWeek, APIUserQualification } from '../modules/API'

interface Props {
	children: ReactNode,
  args?: any,
  test?: boolean
}

export const contexts = {
  employees: createContext([[] as APIPerson[], 0 as any]),
  blocks: createContext([{Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as APICourseBlockWeek, 0 as any]),
  userQuals: createContext([[{course_id: "loading", qualified: false}] as APIUserQualification[], 0 as any]),
}

export const APIContext: FC<Props> = ({children, args, test}) => {
  const employeeState = useState([] as APIPerson[]);
  const blockState = useState({Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as APICourseBlockWeek);
  const userQualState = useState([{course_id: "loading", qualified: false}] as APIUserQualification[]);

  useEffect(() => {
    const APIPromises = (test)? API.fetchAllDummy() : API.fetchAll();
    APIPromises.employees.then((resp) => {
      employeeState[1](resp);
    });

    APIPromises.blocks.then((resp) => {
      blockState[1](resp);
    });

    APIPromises.userQuals.then((resp) => {
      userQualState[1](resp);
    });

    // eslint-disable-next-line
  }, []); // The empty array is so that this effect is ran only on render and not on "test" update.

  return (
	  < contexts.employees.Provider value={employeeState} >
      < contexts.blocks.Provider value={blockState} >
        < contexts.userQuals.Provider value={userQualState} >
		      {children}
        </contexts.userQuals.Provider>
      </contexts.blocks.Provider>
	  </ contexts.employees.Provider>
  )
}

export default APIContext