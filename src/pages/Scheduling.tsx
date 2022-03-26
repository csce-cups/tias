import React from 'react';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import { APIContext } from '../Components/APIContext'
import '../Components/common.scss';

export const Scheduling = () => {
  return (
    <div className="app-body">
      < APIContext test={true}>
        < EmployeeList />
        < SchedulingWindow />
      </APIContext>
    </div>
  );
}

export default Scheduling;
