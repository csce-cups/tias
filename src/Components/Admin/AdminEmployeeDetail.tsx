import React, { FC, useContext, useEffect, useState } from 'react'
import { CourseBlockWeek, Person } from '../../modules/API';
import { compressWeek } from '../../modules/BlockManipulation';
import contexts from '../APIContext';
import { SchedulingWindow } from '../Scheduling/SchedulingWindow';
import back_arrow from '../../assets/back_arrow_icon.svg';
import { PreferenceBlock } from '../Profile/PreferenceBlock';

interface Props {
  employee: Person
}

export const AdminEmployeeDetail: FC<Props> = ({employee}) => {
  const [editing, setEditingState] = useState(false);
  const [showRender, setShowRender] = useState(false);
  const [viable,] = useContext(contexts.userViableCourses);
  const [quals,] = useContext(contexts.userQuals);

  const getUserViable = () => {
    
  }

  const setEditing = (to: boolean) => {
    setEditingState(to);
    if (!to) {
      setTimeout(() => {
        setShowRender(to);
      }, 800);
    } else {
      setShowRender(to);
    }
  }

  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(viable), () => {}];

  return (
    <>
      <div className={`full-modal-container interact-blocks ${editing? '' : 'hidden'}`}>
        <div className={`full-modal ${editing? '' : 'hidden'}`}>
          { showRender?
            <>
              <div className="vstack bside">
                <button className="red button" style={{padding: '0 5em', marginBottom: '10px'}} onClick={() => setEditing(false)}>Exit</button>
                <div className="title">{employee.first_name} {employee.last_name}</div>
                { quals.map(qual => (
                  <span className="course-row">
                    <strong>
                      CSCE {qual.course_number} &nbsp;
                    </strong>
                    <div className={qual.qualified? 'success' : 'fail'}>
                      {qual.qualified? 'Qualified' : 'Not Qualified'}
                    </div>
                  </span>
                ))}
              </div>
              < contexts.blocks.Provider value={blocksPayload} >
                < SchedulingWindow renderBlockType={PreferenceBlock} options={{
                  noHeader: true,
                  noBorder: true,
                  selectable: false,
                  readOnly: true
                }}/>
              </ contexts.blocks.Provider >
            </>
            : <></>
          }
        </div>
        </div>
      <button className="blue button fill-restricted" onClick={() => setEditing(true)}>View user</button>
    </>
  )
}
