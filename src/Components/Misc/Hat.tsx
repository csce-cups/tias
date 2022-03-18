import React, { FC } from 'react'
import colorFromId from '../../modules/color'
import { Store } from 'state-pool'
import { APIPerson } from '../../modules/API'

interface Props {
  linkID: number, // An id that ties this dot corresponding dots elsewhere on the page
  APIData: Store
}

export const Hat: FC<Props> = ({linkID, APIData}) => {
  const [employees]: [APIPerson[], ...any] = APIData.useState('employees');
  const {r, g, b, l} = colorFromId(linkID);
  const colors = {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: (l <= 50)? 'white' : 'black'
  }

  const target = employees.find(e => e.person_id === linkID);
  const title = (target !== undefined)? `${target?.first_name} ${target?.last_name}` : ''
  return (
    <div 
      className="hat" 
      link-id={linkID} 
      title={title}
      style={colors} 
      data-testid="hat"
    >{title}</div>
  )
}
