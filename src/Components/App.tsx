import React, { useEffect, useState } from 'react';
import { NavBar } from './Misc/NavBar';
import { EmployeeList } from './EmployeeList/EmployeeList';
import { SchedulingWindow } from './Scheduling/SchedulingWindow';
import './common.scss';
import API, { APIPTListResponse, APIPerson } from '../modules/APIDummy';

export const App = () => {
  const [employees, setEmployees] = useState([] as APIPerson[]);

  useEffect(() => {
    API.fetchPTList().then((response: APIPTListResponse) => {
      setEmployees(response.users);
    })
  }, [])

  return (
    <div className="App">
      < NavBar />
      <div className="app-body">
        < EmployeeList data={employees} />
        < SchedulingWindow />
      </div>
    </div>
  );
}

export default App;

