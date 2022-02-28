import React from 'react';
import { NavBar } from './NavBar';
import { EmployeeList } from './EmployeeList/EmployeeList';
import { ScheduleList } from './ScheduleList/ScheduleList';
import { SchedulingWindow } from './Scheduling/SchedulingWindow';
import './common.scss';

export const App = () => {
  return (
    <div className="App">
      < NavBar />
      <div className="app-body">
        < EmployeeList />
        < SchedulingWindow />
        < ScheduleList />
      </div>
    </div>
  );
}

export default App;

