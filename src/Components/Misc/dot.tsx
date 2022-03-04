import React, { FC } from 'react'

interface Props {
  styles?: any
}

export const Dot: FC<Props> = ({styles}) => {
  return (
    <div className="dot" style={styles}/>
  )
}
