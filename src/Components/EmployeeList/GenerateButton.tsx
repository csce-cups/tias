import React from 'react'
import API, { APICourseBlock, APIPerson } from '../../modules/API'
import contexts from '../APIContext'

export const GenerateButton = () => {
  const runScheduler = (employees: APIPerson[], blocks: any, setEmployees: any, setBlocks: any) => {
    const eIDs = employees.map(e => e.person_id);
    const btn = document.getElementById("generate-schedule-button");
    
    if (btn !== null) btn.innerHTML = 'Generating...';

    API.runSchedulerDummy(eIDs).then((resp) => {
      if (btn !== null) btn.innerHTML = 'Rendering...';
      const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday]; // For easier iteration
      allBlocks.forEach((day: APICourseBlock[], oidx: number) => {
        day.forEach((block: APICourseBlock, iidx: number) => {
          const pids = resp.scheduled.has(`${block.section_id}`)? resp.scheduled.get(`${block.section_id}`)! : [];
          allBlocks[oidx][iidx].scheduled = pids;
        });
      });

      // Update if the employees are scheduled or not
      employees.forEach((e, i) => {
        employees[i].isScheduled![1](resp.unscheduled.indexOf(e.person_id) === -1)
      });

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
