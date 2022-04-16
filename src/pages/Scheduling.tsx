import React, { useContext, useState } from 'react';
import contexts from '../Components/APIContext';
import '../Components/common.scss';
import { EmployeeList } from '../Components/EmployeeList/EmployeeList';
import { SchedulingBlock } from '../Components/Scheduling/SchedulingBlock';
import { SchedulingWindow } from '../Components/Scheduling/SchedulingWindow';

export const Scheduling = () => {
  const {doShowScheduling} = useContext(contexts.user);
  const editState = useState<boolean>(false);

  if (doShowScheduling) {
    return (
      <div className="app-body">
        < EmployeeList editingState={editState}/>
        < SchedulingWindow renderBlockType={SchedulingBlock} options={{editing: editState[0]}}/>
      </div>
    );
  } else if (doShowScheduling === false) {
    return <div className="page-text">You do not have permission to visit this page.</div>
  } else {
    return <div className="page-text">Loading...</div>
  }
}

export default Scheduling;
