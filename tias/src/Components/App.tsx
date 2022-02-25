import React from 'react';
import { EmployeeList } from './EmployeeList/EmployeeList';
import { ScheduleList } from './ScheduleList/ScheduleList';
import { SchedulingWindow } from './Scheduling/SchedulingWindow';
import './common.scss';

export const App = () => {
  return (
    <div className="App">
      < EmployeeList />
      < SchedulingWindow />
      < ScheduleList />
    </div>
  );
}

export default App;

