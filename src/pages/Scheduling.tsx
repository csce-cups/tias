import React from 'react';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import './../Components/common.scss';

export const Scheduling = () => {
  return (
    <div className="App">
      <div className="app-body">
      < EmployeeList />
      < SchedulingWindow />
      </div>
  </div>
  );
}

export default Scheduling;