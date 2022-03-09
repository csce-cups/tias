import React from 'react';
import { NavBar } from './Misc/NavBar';
import { EmployeeList } from './EmployeeList/EmployeeList';
import { SchedulingWindow } from './Scheduling/SchedulingWindow';
import './common.scss';

export const App = () => {
  return (
    <div className="App">
      < NavBar />
      <div className="app-body">
        < EmployeeList />
        < SchedulingWindow />
      </div>
    </div>
  );
}

export default App;

