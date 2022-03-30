import React, { FC } from 'react'
import colorFromId from '../../modules/color'
import contexts from '../APIContext'
import { Person } from '../../modules/API'

interface Props {
  linkID: number, // An id that ties this dot corresponding dots elsewhere on the page
}

export const Hat: FC<Props> = ({linkID}) => {
  if (linkID === -1) {
    return (
      <div className="hat alert">
        <span className="alert-text">UNSCHEDULED</span>
      </div>
    )
  }
  
  const getName = (employees: Person[]) => {
    const target = employees.find(e => e.person_id === linkID);
    return (target !== undefined)? `${target?.first_name} ${target?.last_name}` : ''
  }

  const {r, g, b, l} = colorFromId(linkID);
  const colors = {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    // color: (l <= 50)? 'white' : 'black'
  }


  return (
    < contexts.employees.Consumer >
      {([employees, setEmployees]) => (
        <div 
          className={`hat ${(l <= 50)? 'white' : 'black'}-text`}
          link-id={linkID} 
          title={getName(employees)}
          style={colors} 
          data-testid="hat"
          >
            <span>{getName(employees)}</span>
        </div>
      )}
    </contexts.employees.Consumer>
  )
}
