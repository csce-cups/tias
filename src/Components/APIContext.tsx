import React, { createContext, FC, ReactNode, useEffect, useState } from "react";
import { loadSchedule, updateWithSchedule } from "../modules/BlockFunctions";
import API, { Person, CourseBlockWeek, APIUserQualification, APIUserPreferences, APIUserPreferenceEnum, parseCookie, TradeRequest, CourseBlock} from "../modules/API";

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

export interface PersonPrefLink {
  person_id: number
  pref: APIUserPreferenceEnum
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

  blockUpdate: createContext<(actions: BlockUpdateAction[]) => void>(0 as any),

  loadedSchedule: createContext<[Map<string, number[]>, React.Dispatch<React.SetStateAction<Map<string, number[]>>>]>([
    new Map<string, number[]>(),
    0 as any
  ]),

  allViableCourses: createContext<[
    Map<number, CourseBlockWeek>, React.Dispatch<React.SetStateAction<Map<number, CourseBlockWeek>>>,
    Map<number, PersonPrefLink[]>
  ]>([
    new Map<number, CourseBlockWeek>(),
    0 as any,
    new Map<number, PersonPrefLink[]>()
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


export type BlockAction = "block" | "section";
export interface BlockUpdateAction {
  action: BlockAction;
  block: CourseBlock;
  splice: Object;
}
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

  // Essentially a custom reducer for the blocks
  const blockUpdate = (actions: BlockUpdateAction[]) => {
    const keys: (keyof CourseBlockWeek)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    actions.forEach(({action, block, splice}) => {
      switch (action) {
        case "block": 
          keys.forEach(k => blockState[0][k] = blockState[0][k]?.map(b => (b.section_id === block.section_id && b.weekday === block.weekday) ? {...b, ...splice} : b) || null);
          break;
        case "section":
          keys.forEach(k => blockState[0][k] = blockState[0][k]?.map(b => (b.section_id === block.section_id) ? {...b, ...splice} : b) || null);
          break;
      }
    })
    
    blockState[1]({
      Monday: blockState[0].Monday,
      Tuesday: blockState[0].Tuesday,
      Wednesday: blockState[0].Wednesday,
      Thursday: blockState[0].Thursday,
      Friday: blockState[0].Friday
    });
  }

  const loadedScheduleState = useState(new Map<string, number[]>());
  const allViableCoursesState = useState(new Map<number, CourseBlockWeek>());
  const allViableCoursesMap = useState(new Map<number, PersonPrefLink[]>());

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

  useEffect(() => {
    let newMap = new Map<number, PersonPrefLink[]>();
    const keys: (keyof CourseBlockWeek)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    allViableCoursesState[0].forEach((week, id) => {
      keys.forEach(k => {
        week[k]?.forEach(course => {
          if (newMap.has(course.section_id)) {
            const get = newMap.get(course.section_id);
            if (!get?.find(e => e.person_id === id)) newMap.get(course.section_id)!.push({
              person_id: id, pref: (course as any).preference
            });
          } else {
            newMap.set(course.section_id, [{person_id: id, pref: (course as any).pref}]);
          }
        })
      });
    });
    
    allViableCoursesMap[1](newMap);
  }, [allViableCoursesState[0]])

  return ( // Wish we'd used redux
    <contexts.googleData.Provider value={googleDataState}>
      <contexts.employees.Provider value={employeeState}>
        <contexts.user.Provider value={user}>
          <contexts.blocks.Provider value={blockState}>
            <contexts.blockUpdate.Provider value={blockUpdate}>
              <contexts.loadedSchedule.Provider value={loadedScheduleState}>
                <contexts.allViableCourses.Provider value={[...allViableCoursesState, allViableCoursesMap[0]]}>
                  <contexts.userQuals.Provider value={userQualState}>
                    <contexts.userPrefs.Provider value={userPrefState}>
                      <contexts.userViableCourses.Provider value={userViableCourses}>
                        <contexts.userTrades.Provider value={userTrades}>
                          {children}
                        </contexts.userTrades.Provider>
                      </contexts.userViableCourses.Provider>
                    </contexts.userPrefs.Provider>
                  </contexts.userQuals.Provider>
                </contexts.allViableCourses.Provider>
              </contexts.loadedSchedule.Provider>
            </contexts.blockUpdate.Provider>
          </contexts.blocks.Provider>
        </contexts.user.Provider>
      </contexts.employees.Provider>
    </contexts.googleData.Provider>
  );
};

export default contexts;
