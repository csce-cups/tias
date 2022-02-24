import React from 'react';
import { EmployeeList } from './EmployeeList';
import { ScheduleList } from './ScheduleList';
import { ScheduleWindow } from './ScheduleWindow';
import './common.scss';

export const App = () => {
  return (
    <div className="App">
      < EmployeeList width='20vh' />
      < ScheduleWindow width='100vh'/>
      < ScheduleList width='15vh'/>
    </div>
  );
}

export default App;

