import React, { useContext } from 'react'
import API from '../../modules/API';
import contexts from '../APIContext';

export const SaveButton = () => {
  const [loadedSchedule, setLoadedSchedule] = useContext(contexts.loadedSchedule);
  const saveSchedule = () => {
    const btn = document.getElementById("save-schedule-button");

    if (loadedSchedule.size === 0) {
      if (btn !== null) btn.innerHTML = 'Nothing to save!';
      setTimeout(() => {
        if (btn !== null) btn.innerHTML = 'Save Schedule';
      }, 5000);
      return;
    }
    
    if (btn !== null) btn.innerHTML = 'Saving...';
    API.sendSavedSchedule(loadedSchedule).then(() => {
      if (btn !== null) btn.innerHTML = 'Saved!';
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred.';
    })
  }

  return (
    <button disabled={(loadedSchedule.size === 0)} id="save-schedule-button" className="green button" onClick={saveSchedule}>
      {(loadedSchedule.size === 0)? 'Nothing to Save' : 'Save Schedule'}
    </button>
  )
}
