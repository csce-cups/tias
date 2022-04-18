import React, { useContext } from 'react';
import contexts from '../Components/APIContext';
import '../Components/common.scss';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { SchedulingBlock } from '../Components/Scheduling/SchedulingBlock';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';

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
