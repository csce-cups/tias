import React, { FC } from 'react';

interface Props {
  filter: Map<number, boolean>
  setFilter: Function
}

export const SchedulingFilter: FC<Props> = ({ filter, setFilter }) => {
  let filter_subjects = Array.from(filter.keys()).map(key => `${key}`).sort();
  const [toggleAll, setToggleAll] = React.useState(Array.from(filter).some(v => !v[1])? "Show all" : "Show none");
  let filter_elements = [];

  const update = (target: string) => () => {
    if (target === "Show all") {
      setFilter(new Map(filter_subjects.map(key => [parseInt(key), true]))) // All courses shown true
      setToggleAll("Show none");
    } else if (target === "Show none") {
      setFilter(new Map(filter_subjects.map(key => [parseInt(key), false]))) // All courses shown false
      setToggleAll("Show all");
    } else {
      let n: number = parseInt(target);
      setFilter(new Map(filter.set(n, !filter.get(n))));
      if (filter_subjects.some(key => filter.get(parseInt(key)))) {
        setToggleAll("Show all");
      }
    }   
  }

  filter_subjects.forEach((subject, i) => {
    filter_elements[i] = <div onClick={update(subject)} className="center filter element" key={`filter-${subject}-${filter.get(parseInt(subject))}`} style={{ 
      textDecoration: filter.get(parseInt(subject))? undefined : 'line-through'
    }}>{subject}</div>
  })

  // The last element is the toggle  
  filter_elements.push(<div onClick={update(toggleAll)} className="center filter element" key={`filter-showall`} style={{ 
    borderRight: 0,
    flex: 'none',
    padding: '0 5px'
  }}>{toggleAll}</div>)

  return (
    <div className="hstack filter">
      <div className="static filter element">CSCE:</div>
      {filter_elements}
    </div>
  )
}
