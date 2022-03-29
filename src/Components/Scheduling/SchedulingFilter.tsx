import React, { FC, useEffect } from 'react'

interface Props {
  filter: Map<number, boolean>
  setFilter: Function
}

export const SchedulingFilter: FC<Props> = ({ filter, setFilter }) => {
  let filter_subjects = Array.from(filter.keys()).map(key => `${key}`).sort();
  const showAll = 'Show All'
  let filter_elements = [];

  const update = (target: string) => () => {
    if (target === showAll) {
      setFilter(new Map(filter_subjects.map(key => [parseInt(key), true]))) // All courses shown true
    } else {
      let n: number = parseInt(target);
      setFilter(new Map(filter.set(n, !filter.get(n))));
    }   
  }

  const len = filter_subjects.length

  filter_subjects.forEach((subject, i) => {
    filter_elements[i] = <div onClick={update(subject)} className="center filter element" key={`filter-${subject}-${filter.get(parseInt(subject))}`} style={{ 
      textDecoration: filter.get(parseInt(subject))? undefined : 'line-through'
    }}>{subject}</div>
  })

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
