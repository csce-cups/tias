import React, { FC } from 'react'
interface Props{
    sections: any
    title: String
}
const days = ["Sun", "M","T","W","H","F","Sat"];
export const Selection: FC<Props> = ({title, sections}) => {
  //maybe make a colored box display depending on
  let info=(
    <div>
      <p>
        Course: 
      </p>
      <p>
        Section:
      </p>
      <p>
        Meeting Time: 
      </p>
      {/* <hr/> */}
    </div>
  );
  if(sections.valid){

    info=(<div>
    <p>
      Course: {sections.course}
    </p>
    <p>
      Section: {sections.section}
    </p>
    <p>
      Meeting Time: {days[sections.start.getDay()]} {sections.start.getHours()}:{sections.start.getMinutes()}-{sections.end.getHours()}:{sections.end.getMinutes()}
    </p>
    <hr/>
  </div>)
  }
  return (
    <div style={{width:"12vw"}}>
        <h1>{title}</h1>
        <div>{info}</div>
    </div>
  )
}

