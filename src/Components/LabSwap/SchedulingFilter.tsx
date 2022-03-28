import React, { FC } from 'react'

interface Props {
  filter: any//object int:bool
  setFilter: Function
}
const base = {
  121: true,
  221: true,
  222: true,
  312: true,
  314: true,
  313: true,
  315: true
}

export const SchedulingFilter: FC<Props> = ({ filter, setFilter }) => {
  let filter_subjects = ['121', '221', '222', '312', '313', '314', '315'];
  const showAll = 'Show All'
  let filter_elements = [];

  const update = (target: string) => () => {
    if (target === showAll) {
      setFilter(base); // All courses shown true
    } else {
      let n: number = parseInt(target);
      setFilter((prev: any) => {
        let temp = { ...prev }
        temp[n] = !prev[n];
        return temp;
      });
    }   
  }

  const len = filter_subjects.length

  for (let i = 0; i < len; i++) {
    // Enabled filters are shown in black (monitored by filter[parseInt(filter_subjects[i])])
    filter_elements[i] = <div onClick={update(filter_subjects[i])} className="center filter element" key={`filter-${filter_subjects[i]}`} style={{ 
      textDecoration: filter[parseInt(filter_subjects[i])]? undefined : 'line-through'
    }}>{filter_subjects[i]}</div>
  }

  // The last element is the toggle  
  filter_elements.push(<div onClick={update(showAll)} className="center filter element" key={`filter-showall`} style={{ 
    borderRight: 0,
    flex: 'none',
    padding: '0 5px'
  }}>{showAll}</div>)

  return (
    <div className="hstack filter">
      <div className="static filter element">CSCE:</div>
      {filter_elements}
    </div>
  )
}
