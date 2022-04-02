import React, { createContext, FC, ReactNode, useEffect, useState } from "react";
import API, { Person, CourseBlockWeek, APIUserQualification, APIUserPreferences, APIUserPreferenceEnum, parseCookie} from "../modules/API";

interface Props {
  children: ReactNode;
  args?: any;
  test?: boolean;
}

export const contexts = {
  googleData: createContext({} as any),

  employees: createContext<[Person[], React.Dispatch<React.SetStateAction<Person[]>>]>(
    [[] as Person[], 0 as any]
  ),

  blocks: createContext<[CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>]>([
    { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as CourseBlockWeek,
    0 as any,
  ]),

  userQuals: createContext<[APIUserQualification[], React.Dispatch<React.SetStateAction<APIUserQualification[]>>]>([
    [{ course_id: -1, course_number: "loading", qualified: false }] as APIUserQualification[],
    0 as any,
  ]),

  userPrefs: createContext<[APIUserPreferences, React.Dispatch<React.SetStateAction<APIUserPreferences>>]>(
    [new Map<number, APIUserPreferenceEnum>(), 0 as any]
  )
};

export const APIContext: FC<Props> = ({ children, args, test }) => {
  const googleDataState = useState({} as any);
  const employeeState = useState([] as Person[]);
  const blockState = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
  } as CourseBlockWeek);

  const userQualState = useState([
    { course_id: -1, course_number: "loading", qualified: false },
  ] as APIUserQualification[]);

  const userPrefState = useState(new Map<number, APIUserPreferenceEnum>());

  useEffect(() => {
    const dataPromises = test ? API.fetchAllStaticDummy() : API.fetchAllStatic();
    dataPromises.employees.then((resp) => {
      employeeState[1](resp);
    });

    dataPromises.blocks.then((resp) => {
      blockState[1](resp);
    });

    // eslint-disable-next-line
  }, []); // Fetch static data right away

  useEffect(() => {
    const userPromises = test ? API.fetchAllUserDummy(parseCookie().tias_user_id) : API.fetchAllUser(parseCookie().tias_user_id);

    userPromises.userQuals.then((resp) => {
      userQualState[1](resp);
    });

    userPromises.userPrefs.then((resp) => {
      userPrefState[1](resp);
    });

  }, [googleDataState[0]]); // Fetch user specific data when user is logged in

  return (
    <contexts.googleData.Provider value={googleDataState}>
      <contexts.employees.Provider value={employeeState}>
        <contexts.blocks.Provider value={blockState}>
          <contexts.userQuals.Provider value={userQualState}>
            <contexts.userPrefs.Provider value={userPrefState}>
              {children}
            </contexts.userPrefs.Provider>
          </contexts.userQuals.Provider>
        </contexts.blocks.Provider>
      </contexts.employees.Provider>
    </contexts.googleData.Provider>
  );
};

export default contexts;
