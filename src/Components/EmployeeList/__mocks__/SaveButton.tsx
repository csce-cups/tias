import React, { useContext } from 'react';
import contexts from '../../APIContext';

export const SaveButton = () => {
  const [loadedSchedule, setLoadedSchedule] = useContext(contexts.loadedSchedule);
  return (
    <button disabled={(loadedSchedule.size === 0)} id="save-schedule-button">
      {(loadedSchedule.size === 0)? 'Nothing to Save' : 'Save Schedule'}
    </button>
  )
}
