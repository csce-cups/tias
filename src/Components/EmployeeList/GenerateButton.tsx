import React from 'react'
import API, { APICourseBlock, APIPerson } from '../../modules/API'
import contexts from '../APIContext'

export const GenerateButton = () => {
  const runScheduler = (employees: APIPerson[], setBlocks: any, blocks: any) => {
    const eIDs = employees.map(e => e.person_id);
    API.runScheduler(eIDs).then((resp) => {
      const allBlocks = [blocks.Monday, blocks.Tuesday, blocks.Wednesday, blocks.Thursday, blocks.Friday]; // For easier iteration
      allBlocks.forEach((day: APICourseBlock[], oidx: number) => {
        day.forEach((block: APICourseBlock, iidx: number) => {
          allBlocks[oidx][iidx].scheduled = (resp.scheduled.has(`${block.section_id}`))? resp.scheduled.get(`${block.section_id}`)! : [];
        });
      });

      setBlocks({Monday: allBlocks[0], Tuesday: allBlocks[1], Wednesday: allBlocks[2], Thursday: allBlocks[3], Friday: allBlocks[4]});
    })
  }

  return (
    < contexts.blocks.Consumer >
      {([blocks, setBlocks]) => (
        < contexts.employees.Consumer >
          {([employees, setEmployees]) => (
            <button className="blue button" onClick={() => runScheduler(employees, setBlocks, blocks)}>Generate</button>
          )}
        </contexts.employees.Consumer>
      )}
    </contexts.blocks.Consumer>
  )
}
