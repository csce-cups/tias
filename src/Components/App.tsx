import React from 'react';
import { NavBar } from './Misc/NavBar';
import { EmployeeList } from './EmployeeList/EmployeeList';
import { SchedulingWindow } from './Scheduling/SchedulingWindow';
import { APIContext } from './APIContext'
import './common.scss';

export const App = () => {
  return (
    <div className="App">
      < NavBar />
      <div className="app-body">
        < APIContext test={false}>
          < EmployeeList />
          < SchedulingWindow />
        </APIContext>
      </div>
    </div>
  );
}

export default App;

