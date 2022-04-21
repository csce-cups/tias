import React, { FC, ReactNode } from "react";
import { Person } from "../../modules/API";
import { contexts, _initstates } from "../APIContextHelper";

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

export const APIContext: FC<Props> = ({ children, args, test }) => {
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
