import React, { FC } from 'react'

interface Props {
  styles?: any
}

const emphasizeLinked = () => {
  let arr = Array.from(document.getElementsByClassName("dot"));
  // arr.forEach(e => )
  console.log(arr);
}
const deemphasizeLinked = () => {
  console.log("OUT");
}

export const Dot: FC<Props> = ({styles}) => {
  return (
    <div className="dot" style={styles} onMouseOver={emphasizeLinked} onMouseOut={deemphasizeLinked}/>
  )
}
