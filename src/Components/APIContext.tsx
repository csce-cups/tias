import React, { createContext, FC, ReactNode, useEffect, useState } from "react";
import API, { Person, CourseBlockWeek, APIUserQualification, APIUserPreferences, APIUserPreferenceEnum, parseCookie} from "../modules/API";

const permAdmin : string | undefined = process.env.REACT_APP_ADMIN_EMAIL

interface Props {
  children: ReactNode;
  args?: any;
  test?: boolean;
}

interface UserPerson {
  user: Person | null
  doShowProfile: boolean | null
  doShowScheduling: boolean | null
  doShowLabSwap: boolean | null
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

  loadedSchedule: createContext<[Map<string, number[]>, React.Dispatch<React.SetStateAction<Map<string, number[]>>>]>([
    new Map<string, number[]>(),
    0 as any
  ]),

  user: createContext<UserPerson>({
    user: null,
    doShowProfile: null,
    doShowScheduling: null,
    doShowLabSwap: null
  }),

  userQuals: createContext<[APIUserQualification[], React.Dispatch<React.SetStateAction<APIUserQualification[]>>]>(
  [
    [{ course_id: -1, course_number: "loading", qualified: false }] as APIUserQualification[],
    0 as any,
  ]),

  userPrefs: createContext<[APIUserPreferences, React.Dispatch<React.SetStateAction<APIUserPreferences>>]>(
    [new Map<number, APIUserPreferenceEnum>(), 0 as any]
  ),

  userViableCourses: createContext<[CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>]>([
    { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as CourseBlockWeek,
    0 as any,
  ]),
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

  const loadedScheduleState = useState(new Map<string, number[]>());
  const [user, setUser] = useState<UserPerson>({
    user: null,
    doShowProfile: null,
    doShowScheduling: null,
    doShowLabSwap: null
  })

  const userQualState = useState([
    { course_id: -1, course_number: "loading", qualified: false },
  ] as APIUserQualification[]);

  const userPrefState = useState(new Map<number, APIUserPreferenceEnum>());
  const userViableCourses = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
  } as CourseBlockWeek);

  useEffect(() => {
    const dataPromises = test ? API.fetchAllStaticDummy() : API.fetchAllStatic();
    dataPromises.employees.then((resp) => {
      employeeState[1](resp);
    });

    dataPromises.blocks.then((resp) => {
      blockState[1](resp);
    });

    const user = employeeState[0].find((e) => e.person_id === +parseCookie().tias_user_id) || null;
    setUser({
      user: user,
      doShowProfile: user && (user.peer_teacher || user.administrator),
      doShowScheduling: user && user.administrator,
      doShowLabSwap: user && (user.peer_teacher || user.administrator)
    })

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

    userPromises.userViableCourses.then((resp) => {
      userViableCourses[1](resp);
    });

    const user = employeeState[0].find((e) => e.person_id === +parseCookie().tias_user_id) || null;
    const isPermAdmin = permAdmin && googleDataState[0].tv === permAdmin;
    if (isPermAdmin) {
      setUser({
        user: user,
        doShowProfile: true,
        doShowScheduling: true,
        doShowLabSwap: true
      })
    } else {
      setUser({
        user: user,
        doShowProfile: (user && (user.peer_teacher || user.administrator)),
        doShowScheduling: (user && user.administrator),
        doShowLabSwap: (user && (user.peer_teacher || user.administrator))
      })
    }


  }, [googleDataState[0]]); // Fetch user specific data when user is logged in

  return (
    <contexts.googleData.Provider value={googleDataState}>
      <contexts.employees.Provider value={employeeState}>
        <contexts.user.Provider value={user}>
          <contexts.blocks.Provider value={blockState}>
            <contexts.loadedSchedule.Provider value={loadedScheduleState}>
              <contexts.userQuals.Provider value={userQualState}>
                <contexts.userPrefs.Provider value={userPrefState}>
                  <contexts.userViableCourses.Provider value={userViableCourses}>
                    {children}
                  </contexts.userViableCourses.Provider>
                </contexts.userPrefs.Provider>
              </contexts.userQuals.Provider>
            </contexts.loadedSchedule.Provider>
          </contexts.blocks.Provider>
        </contexts.user.Provider>
      </contexts.employees.Provider>
    </contexts.googleData.Provider>
  );
};

export default contexts;
