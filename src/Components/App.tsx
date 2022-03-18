import React, { useEffect } from 'react';
import { createStore } from 'state-pool'
import { NavBar } from './Misc/NavBar';
import { EmployeeList } from './EmployeeList/EmployeeList';
import { SchedulingWindow } from './Scheduling/SchedulingWindow';
import './common.scss';
import API, { APIPTListResponse, APIPerson } from '../modules/APIDummy';

const APIData = createStore();
APIData.setState("employees", [] as APIPerson[])

export const App = () => {
  const [, setEmployees] = APIData.useState("employees");

  useEffect(() => {
    API.fetchPTList().then((response: APIPTListResponse) => {
      setEmployees(response.users);
    })
  }, [])

  return (
    <div className="App">
      < NavBar />
      <div className="app-body">
        < EmployeeList APIData={APIData} />
        < SchedulingWindow APIData={APIData} />
      </div>
    </div>
  );
}

export default App;

