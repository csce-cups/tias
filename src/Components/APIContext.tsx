import React, { createContext, FC, ReactNode, useEffect, useState } from "react";
import { loadSchedule, updateWithSchedule } from "../modules/BlockManipulation";
import API, { Person, CourseBlockWeek, APIUserQualification, APIUserPreferences, APIUserPreferenceEnum, parseCookie, TradeRequest} from "../modules/API";

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
  doShowAdmin: boolean | null
}

export const contexts = {
  googleData: createContext<[any, React.Dispatch<React.SetStateAction<any>>]>([
    {}, 0 as any
  ]),

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
    doShowLabSwap: null,
    doShowAdmin: null
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

  userTrades: createContext<[TradeRequest[], React.Dispatch<React.SetStateAction<TradeRequest[]>>]>([
    [] as TradeRequest[],
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
    doShowLabSwap: null,
    doShowAdmin: null
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

  const userTrades = useState([] as TradeRequest[]);
  const [all, setAll] = useState([] as Person[]);

  useEffect(() => {
    const dataPromises = test ? API.fetchAllStaticDummy() : API.fetchAllStatic();
    let employees: Person[];
    let blocks: CourseBlockWeek;

    Promise.all([
      new Promise<void>(resolve => dataPromises.employees.then((resp) => {
        setAll(resp);
        employees = resp.filter(e => e.peer_teacher);
      }).then(() => resolve())),
      new Promise<void>(resolve => dataPromises.blocks.then((resp) => blocks = resp).then(() => resolve()))
    ]).then(() => {
      loadSchedule({
        employees: employees,
        setEmployees: employeeState[1],
        blocks: blocks,
        setBlocks: blockState[1],
        setLoadedSchedule: loadedScheduleState[1]
      });

      const user = all.find((e) => e.person_id === parseInt(parseCookie().tias_user_id)) || null;
      setUser({
        user: user,
        doShowProfile: (user && user.peer_teacher),
        doShowScheduling: (user && user.administrator),
        doShowLabSwap: (user && user.peer_teacher),
        doShowAdmin: (user && user.administrator)
      })
    })


    // eslint-disable-next-line
  }, []); // Fetch static data right away

  useEffect(() => {
    const user = all.find((e) => e.person_id === googleDataState[0].tias_user_id) || null;
    const userPromises = test ? API.fetchAllUserDummy(user?.person_id) : API.fetchAllUser(user?.person_id);

    userPromises.userQuals.then((resp) => {
      userQualState[1](resp);
    });

    userPromises.userPrefs.then((resp) => {
      userPrefState[1](resp);
    });

    userPromises.userViableCourses.then((resp) => {
      userViableCourses[1](resp);
    });

    userPromises.userTrades.then((resp) => {
      userTrades[1](resp);
    });
    
    const isPermAdmin = permAdmin && googleDataState[0].tv === permAdmin;
    if (isPermAdmin) {
      setUser({
        user: user,
        doShowProfile: true,
        doShowScheduling: true,
        doShowLabSwap: true,
        doShowAdmin: true
      })
    } else {
      setUser({
        user: user,
        doShowProfile: (user && user.peer_teacher),
        doShowScheduling: (user && user.administrator),
        doShowLabSwap: (user && user.peer_teacher),
        doShowAdmin: (user && user.administrator)
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
                    <contexts.userTrades.Provider value={userTrades}>
                      {children}
                    </contexts.userTrades.Provider>
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
