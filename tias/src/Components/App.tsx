import React from 'react';
import { EmployeeList } from './EmployeeList';
import { ScheduleList } from './ScheduleList';
import { ScheduleWindow } from './ScheduleWindow';
import './common.scss';

export const App = () => {
  return (
    <div className="App">
      < EmployeeList width='25vh' />
      < ScheduleWindow />
      < ScheduleList width='20vh'/>
    </div>
  );
}

export default App;

