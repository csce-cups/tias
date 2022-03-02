import React from 'react';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import { NavBar } from '../Components/NavBar';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { ScheduleList } from '../Components/ScheduleList/ScheduleList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import './../Components/common.scss';

export const Landing = () => {
  return (
    <div className="Landing">
    </div>
  );
}

export default Landing;