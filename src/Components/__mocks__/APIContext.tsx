import React, { FC, ReactNode, useEffect } from "react";
import { CourseBlockWeekKey, Person } from "../../modules/API";
import API from "../../modules/__mocks__/API";
import { contexts, PersonPrefLink, _initstates } from "../APIContextHelper";

interface Props {
  children: ReactNode;
  args?: any;
  test?: boolean;
}

export const APIContext: FC<Props> = ({ children }) => {
  const {
    googleDataState,
    employeeState,
    blockState,
    blockUpdate,
    loadedScheduleState,
    allViableCoursesState,
    allViableCoursesMap,
    user,
    userQualState,
    userPrefState,
    userViableCourses,
    userTrades,
  } = _initstates();

  API.fetchPTList(true).then(resp => employeeState[0] = resp);
  API.fetchCourseBlocks(true).then(resp => blockState[0] = resp);
  API.getSavedSchedule().then(resp => loadedScheduleState[0] = resp);
  API.fetchUserQualifications(0, true).then(resp => userQualState[0] = resp);
  API.fetchUserPreferences(0, true).then(resp => userPrefState[0] = resp);
  API.fetchUserViableCourses(0, true).then(resp => userViableCourses[0] = resp);
  API.fetchUserTrades(0, true).then(resp => userTrades[0] = resp);
  API.fetchAllViableCourses(true).then(resp => {
    allViableCoursesState[0] = resp

    let newMap = new Map<number, PersonPrefLink[]>();
    const keys: CourseBlockWeekKey[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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
    allViableCoursesMap[0] = newMap;
  });

  
  
  
  
  

  return (
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
