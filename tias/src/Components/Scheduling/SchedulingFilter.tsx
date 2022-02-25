import React from 'react'

export const SchedulingFilter = () => {
  let filter_subjects = ['ALL', '121', '221', '312', '313', '314', '315'];
  let filter_elements = [];
  
  for (let i = 0; i < filter_subjects.length; i++) {
    filter_elements[i] = <div className="center filter element">{filter_subjects[i]}</div>;
  }

  return (
	  <div className="row filter">
      <div className="static filter element">CSCE:</div>
      {filter_elements}
    </div>
  )
}
