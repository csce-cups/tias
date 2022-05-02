import React, { FC, ReactNode, useEffect, useState } from "react";
import API, { CourseBlockWeek, parseCookie, Person } from "../modules/API";
import { loadSchedule } from "../modules/BlockFunctions";
import { contexts, reverseViableCourses, _initstates } from "./APIContextHelper";

const permAdmin : string | undefined = process.env.REACT_APP_ADMIN_EMAIL

interface Props {
  children: ReactNode;
  args?: any;
  test?: boolean;
}

export const APIContext: FC<Props> = ({ children, args, test }) => {
  const {
    googleDataState,
    employeeState,
    blockState,
    blockUpdate,
    loadedScheduleState,
    allViableCoursesState,
    allViableCoursesMap,
    user, setUser,
    userQualState,
    userPrefState,
    userViableCourses,
    userTrades,
  } = _initstates();

  let [all, setAll] = useState([] as Person[]);

  useEffect(() => {
    const dataPromises = API.fetchAllStatic();
    let employees: Person[];
    let blocks: CourseBlockWeek;

    Promise.all([
      new Promise<void>(resolve => dataPromises.employees.then((resp) => {
        all = resp;
        setAll(resp);
        employees = resp?.filter(e => e.peer_teacher);
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

      // const user = all.find((e) => e.person_id === parseInt(parseCookie().tias_user_id)) || null;
      // setUser({
      //   user: user,
      //   doShowProfile: (user && user.peer_teacher),
      //   doShowScheduling: (user && user.administrator),
      //   doShowLabSwap: (user && user.peer_teacher),
      //   doShowAdmin: (user && user.administrator)
      // })
    })


    // eslint-disable-next-line
  }, []); // Fetch static data right away

  useEffect(() => {
    const user = all.find((e) => e.person_id === +googleDataState[0].tias_user_id) || null;
    const userPromises = API.fetchAllUser(user?.person_id);

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
  }, [googleDataState[0], all]); // Fetch user specific data when user is logged in

  useEffect(() => {
    allViableCoursesMap[1](reverseViableCourses(allViableCoursesState[0]));
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
