import React, { FC, ReactNode, useEffect } from "react";
import { CourseBlockWeek, CourseBlockWeekKey, Person } from "../../modules/API";
import { APINoAsync } from "../../modules/__mocks__/API";
import { contexts, PersonPrefLink, reverseViableCourses, _initstates } from "../APIContextHelper";

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

  employeeState[0] = APINoAsync.fetchPTList();
  blockState[0] = APINoAsync.fetchCourseBlocks();
  loadedScheduleState[0] = APINoAsync.getSavedSchedule();
  userQualState[0] = APINoAsync.fetchUserQualifications();
  userPrefState[0] = APINoAsync.fetchUserPreferences(0);
  userViableCourses[0] = APINoAsync.fetchUserViableCourses(0);
  userTrades[0] = APINoAsync.fetchUserTrades(0);
  allViableCoursesState[0] = APINoAsync.fetchAllViableCourses();
  allViableCoursesMap[0] = reverseViableCourses(allViableCoursesState[0]);

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
