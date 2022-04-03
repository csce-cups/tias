import React, { useState } from 'react';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import '../Components/common.scss';
import { SchedulingBlock } from '../Components/Scheduling/SchedulingBlock';

export const Scheduling = () => {
  return (
    <div className="app-body">
      < EmployeeList />
      < SchedulingWindow renderBlockType={SchedulingBlock}/>
    </div>
  );
}

export default Scheduling;
