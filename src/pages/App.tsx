import React from 'react';
import { NavBar } from '../Components/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { ScheduleList } from '../Components/ScheduleList/ScheduleList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import Profile from './Profile';
import Scheduling from './Scheduling';
import Landing from './Landing';
import './../Components/common.scss';

export const App = () => {
  return (
    <div className="App">
      <Router>
      < NavBar />
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/Scheduling' element={<Scheduling/>} />
        <Route path='/Profile' element={<Profile/>} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;

