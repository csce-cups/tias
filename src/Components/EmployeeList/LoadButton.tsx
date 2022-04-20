import React, { useContext, useEffect } from 'react';
import { loadSchedule } from '../../modules/BlockFunctions';
import contexts from '../APIContext';

export const LoadButton = () => {
  const [loadedSchedule, setLoadedSchedule] = useContext(contexts.loadedSchedule);
  const [employees, setEmployees] = useContext(contexts.employees);
  const [blocks, setBlocks] = useContext(contexts.blocks);

  const runLoadSchedule = () => {
    if (loadedSchedule.size !== 0) {
      if (!window.confirm("This will overwrite your current schedule. Are you sure you want to continue?")) return;
    }

    const btn = document.getElementById("load-schedule-button");
    if (btn !== null) btn.innerHTML = 'Loading...';

    loadSchedule({employees, setEmployees, blocks, setBlocks, setLoadedSchedule}).then(() => {
      if (btn !== null) btn.innerHTML = 'Schedule Loaded!';
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred';
    })
  }

  useEffect(() => {}, [])

  return (
    <button id="load-schedule-button" className="purple button" onClick={runLoadSchedule}>Load Saved Schedule</button>
  )
}
