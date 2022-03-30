import React from 'react'
import API, { CourseBlock, Person } from '../../modules/API'
import contexts from '../APIContext'

export const GenerateButton = () => {
  const runScheduler = (employees: Person[], blocks: any, setEmployees: any, setBlocks: any) => {
    
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
        day.forEach((block: CourseBlock, iidx: number) => {
          const pids = resp.scheduled.has(`${block.section_id}`)? resp.scheduled.get(`${block.section_id}`)! : [];
          allBlocks[oidx][iidx].scheduled = pids;
        });
      });

      // Update if the employees are scheduled or not
      employees.forEach((e, i) => {
        employees[i].isScheduled = resp.unscheduled.indexOf(e.person_id) === -1
      });

      setEmployees(employees);
      setBlocks({Monday: allBlocks[0], Tuesday: allBlocks[1], Wednesday: allBlocks[2], Thursday: allBlocks[3], Friday: allBlocks[4]});
      if (btn !== null) btn.innerHTML = 'Done generating!';

    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred';
    })
  }

  return (
    < contexts.blocks.Consumer >
      {([blocks, setBlocks]) => (
        < contexts.employees.Consumer >
          {([employees, setEmployees]) => (
            <button id="generate-schedule-button" className="blue button" onClick={() => runScheduler(employees, blocks, setEmployees, setBlocks)}>Generate</button>
          )}
        </contexts.employees.Consumer>
      )}
    </contexts.blocks.Consumer>
  )
}
