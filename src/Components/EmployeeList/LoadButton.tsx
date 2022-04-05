import React, { useContext, useEffect } from 'react'
import API, { CourseBlock } from '../../modules/API';
import contexts from '../APIContext';

export const LoadButton = () => {
  const [loadedSchedule, setLoadedSchedule] = useContext(contexts.loadedSchedule);
  const [employees, setEmployees] = useContext(contexts.employees);
  const [blocks, setBlocks] = useContext(contexts.blocks);
  const [userViableCourses, setUserViableCourses] = useContext(contexts.userViableCourses);
  const loadSchedule = () => {
    if (loadedSchedule.size !== 0) {
      if (!window.confirm("This will overwrite your current schedule. Are you sure you want to continue?")) return;
    }
    
    let scheduled = new Set<number>();
    employees.forEach((e, i) => { // At the start of scheduling, nobody is scheduled.
      employees[i].isScheduled = false;
    });
    setEmployees(employees);

    const dropdowns: HTMLInputElement[] = Array.from(document.querySelectorAll('input[type=checkbox][name="employee-row-checkbox"]:checked'));
    const eIDs = dropdowns.filter(e => e.checked).map(e => parseInt(e.getAttribute('person-id')!));
    const btn = document.getElementById("load-schedule-button");
    
    if (btn !== null) btn.innerHTML = 'Loading...';

    API.getSavedSchedule().then((resp) => {
      if (btn !== null) btn.innerHTML = 'Rendering...';
      const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday] as any; // For easier iteration
      allBlocks.forEach((day: any, oidx: number) => {
        day?.forEach((block: any, iidx: number) => {
          const pids = resp.has(`${block.section_id}`)? resp.get(`${block.section_id}`)! : [];
          allBlocks[oidx][iidx].scheduled = pids;
          pids.forEach(id => scheduled.add(id));
        });
      });
      
      // Update if the employees are scheduled or not
      employees.forEach((e, i) => {
        employees[i].isScheduled = scheduled.has(e.person_id);
      });
      
      setEmployees(employees);
      setLoadedSchedule(new Map(resp));
      setBlocks({Monday: allBlocks[0], Tuesday: allBlocks[1], Wednesday: allBlocks[2], Thursday: allBlocks[3], Friday: allBlocks[4]});
      setUserViableCourses({
        Monday: allBlocks[0].filter((b: CourseBlock) => userViableCourses?.Monday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined ), 
        Tuesday: allBlocks[1].filter((b: CourseBlock) => userViableCourses?.Tuesday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined ), 
        Wednesday: allBlocks[2].filter((b: CourseBlock) => userViableCourses?.Wednesday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined ), 
        Thursday: allBlocks[3].filter((b: CourseBlock) => userViableCourses?.Thursday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined ), 
        Friday: allBlocks[4].filter((b: CourseBlock) => userViableCourses?.Friday?.find((bv: CourseBlock) => bv.section_id == b.section_id) !== undefined )
      });
      if (btn !== null) btn.innerHTML = 'Schedule Loaded!';

    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred';
    })
  }

  useEffect(() => {}, [])

  return (
    <button id="load-schedule-button" className="purple button" onClick={loadSchedule}>Load Saved Schedule</button>
  )
}
