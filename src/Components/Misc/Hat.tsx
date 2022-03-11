import React, { FC, useEffect, useRef, useState } from 'react'
import Palette from '../../assets/colors.json'
import uuid from '../../uuid'

interface Props {
  linkID: number // An id that ties this dot corresponding dots elsewhere on the page
  styles?: any
}

export const Hat: FC<Props> = ({linkID, styles}) => {
  return (
    <div 
      className="hat" 
      link-id={linkID} 
      style={{backgroundColor: Palette.colors[linkID % Palette.colors.length], ...styles}} 
      data-testid="hat"
    />
  )
}
