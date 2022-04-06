import React, { useContext } from 'react';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';
import '../Components/common.scss';
import { SchedulingBlock } from '../Components/Scheduling/SchedulingBlock';
import contexts from '../Components/APIContext';

export const Scheduling = () => {
  const {doShowScheduling} = useContext(contexts.user);

  if (doShowScheduling) {
    return (
      <div className="app-body">
      < EmployeeList />
      < SchedulingWindow renderBlockType={SchedulingBlock}/>
    </div>
    );
  } else if (doShowScheduling === false) {
    return <div className="page-text">You do not have permission to visit this page.</div>
  } else {
    return <div className="page-text">Loading...</div>
  }
}

export default Scheduling;
