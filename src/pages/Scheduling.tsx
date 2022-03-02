import React from 'react';
import { NavBar } from '../Components/NavBar';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { ScheduleList } from '../Components/ScheduleList/ScheduleList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import './../Components/common.scss';

export const Scheduling = () => {
  return (
    <div className="App">
      <div className="app-body">
      < EmployeeList />
      < SchedulingWindow />
      < ScheduleList />
      </div>
  </div>
  );
}

export default Scheduling;