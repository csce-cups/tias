import React, { FC } from 'react'
interface Props{
    sections: any
    title: String
}
export const Selection: FC<Props> = ({title, sections}) => {
  //maybe make a colored box display depending on 
  let data=(
    <div>
      <p>Section Data Goes Here</p>
    </div>
  );
  if(sections.valid){

    data=(<div>
    <p>
      Course: {sections.course}
    </p>
    <p>
      Section: {sections.section}
    </p>
    {/* <p>
      Meeting Time: {sections.start}-{sections.end}
    </p> */}
    <hr/>
  </div>)
  }
  return (
    <div style={{paddingLeft:"15px"}}>
        <h1>{title}</h1>
        <div>{data}</div>
    </div>
  )
}

