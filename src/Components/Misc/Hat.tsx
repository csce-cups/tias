import React, { FC } from 'react'
import colorFromId from '../../modules/color'
import contexts from '../APIContext'
import { APIPerson } from '../../modules/API'

interface Props {
  linkID: number, // An id that ties this dot corresponding dots elsewhere on the page
}

export const Hat: FC<Props> = ({linkID}) => {
  
  const getName = (employees: APIPerson[]) => {
    const target = employees.find(e => e.person_id === linkID);
    return (target !== undefined)? `${target?.first_name} ${target?.last_name}` : ''
  }

  const {r, g, b, l} = colorFromId(linkID);
  const colors = {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: (l <= 50)? 'white' : 'black'
  }

  return (
    < contexts.employees.Consumer >
      {([employees, setEmployees]) => (
        <div 
          className="hat" 
          link-id={linkID} 
          title={getName(employees)}
          style={colors} 
          data-testid="hat"
          >{getName(employees)}
        </div>
      )}
    </contexts.employees.Consumer>
  )
}
