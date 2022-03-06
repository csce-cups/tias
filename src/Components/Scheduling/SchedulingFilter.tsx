import React from 'react'
import uuid from '../../uuid';


export const SchedulingFilter = () => {
  let filter_subjects = ['ALL', '121', '221', '312', '313', '314', '315'];
  let filter_elements = [];

  let wrap = (content: string, style?: object) => { return <div key={uuid()} className="center filter element" style={style}>{content}</div>}
  
  const len = filter_subjects.length
  for (let i = 0; i < len - 1; i++) {
    filter_elements[i] = wrap(filter_subjects[i]);
  }
  filter_elements[len - 1] = wrap(filter_subjects[len - 1], {borderRight: 0});

  return (
	  <div className="hstack filter">
      <div className="static filter element">CSCE:</div>
      {filter_elements}
    </div>
  )
}
