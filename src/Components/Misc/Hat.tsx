import React, { FC } from 'react'
import colorFromId from './color'

interface Props {
  linkID: number // An id that ties this dot corresponding dots elsewhere on the page
  styles?: any
}



export const Hat: FC<Props> = ({linkID, styles}) => {
  const {r, g, b, l} = colorFromId(linkID);
  const colors = {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: (l <= 50)? 'white' : 'black'
  }

  return (
    <div 
      className="hat" 
      link-id={linkID} 
      style={{...colors, ...styles}} 
      data-testid="hat"
    >Text</div>
  )
}
