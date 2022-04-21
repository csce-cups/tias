import React, { FC, useContext } from 'react'
import API, { CourseBlock, CourseBlockWeek, Person } from '../../modules/API'
import contexts from '../APIContext'

interface Props {
  genState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const GenerateButton: FC<Props> = ({genState}) => {
  const [loadedSchedule, setLoadedSchedule] = useContext(contexts.loadedSchedule);
  
  const runScheduler = (employees: Person[], blocks: any, setEmployees: any, setBlocks: any, userViableCourses: any, setUserViableCourses: any) => {
    if (loadedSchedule.size !== 0) {
      if (!window.confirm("This will overwrite your current schedule. Are you sure you want to continue?")) return;
    }

    genState[1](true);
    employees.forEach((e, i) => { // At the start of scheduling, nobody is scheduled.
      employees[i].isScheduled = false;
    });
    setEmployees(employees);

    const dropdowns: HTMLInputElement[] = Array.from(document.querySelectorAll('input[type=checkbox][name="employee-row-checkbox"]:checked'));
    const eIDs = dropdowns.filter(e => e.checked).map(e => parseInt(e.getAttribute('person-id')!));
    const btn = document.getElementById("generate-schedule-button");
    
    if (btn !== null) btn.innerHTML = 'Generating...';

    const timer = setTimeout(() => {
      if (btn !== null) btn.innerHTML = 'This may take a moment...';
    }, 5000);

    API.runScheduler(eIDs).then((resp) => {
      clearTimeout(timer);
      
      if (btn !== null) btn.innerHTML = 'Rendering...';
      const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday]; // For easier iteration
      allBlocks.forEach((day: CourseBlock[], oidx: number) => {
        day?.forEach((block: CourseBlock, iidx: number) => {
          const pids = resp.scheduled.has(`${block.section_id}`)? resp.scheduled.get(`${block.section_id}`)! : [];
          allBlocks[oidx][iidx].scheduled = pids;
        });
      });
      
      // Update if the employees are scheduled or not
      employees.forEach((e, i) => {
        employees[i].isScheduled = resp.unscheduled.indexOf(e.person_id) === -1 && eIDs.findIndex(id => id === e.person_id) !== -1;
      });
      
      setLoadedSchedule(resp.scheduled);
      setEmployees(employees);
      setBlocks({Monday: allBlocks[0], Tuesday: allBlocks[1], Wednesday: allBlocks[2], Thursday: allBlocks[3], Friday: allBlocks[4]});
      setUserViableCourses({
        Monday: allBlocks[0]?.filter((b: CourseBlock) => userViableCourses.Monday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined || []), 
        Tuesday: allBlocks[1]?.filter((b: CourseBlock) => userViableCourses.Tuesday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined || []), 
        Wednesday: allBlocks[2]?.filter((b: CourseBlock) => userViableCourses.Wednesday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined || []), 
        Thursday: allBlocks[3]?.filter((b: CourseBlock) => userViableCourses.Thursday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined || []), 
        Friday: allBlocks[4]?.filter((b: CourseBlock) => userViableCourses.Friday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined || [])
      });

      if (btn !== null) btn.innerHTML = 'Done generating!';
      genState[1](false);

    }).catch(err => {
      console.error(err);
      if (btn !== null) btn.innerHTML = 'An error occurred';
    })
  }

  return (
    < contexts.blocks.Consumer >
      {([blocks, setBlocks]) => (
        < contexts.userViableCourses.Consumer >
        {([viable, setViable]) => (
          < contexts.employees.Consumer >
            {([employees, setEmployees]) => (
              <button id="generate-schedule-button" className="blue button" onClick={() => runScheduler(employees, blocks, setEmployees, setBlocks, viable, setViable)}>Generate Schedule</button>
            )}
          </contexts.employees.Consumer>
        )}
        </contexts.userViableCourses.Consumer >
      )}
    </contexts.blocks.Consumer>
  )
}
