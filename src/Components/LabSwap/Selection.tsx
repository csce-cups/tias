import React, { FC } from 'react'
interface Props{
    sections: Array<any>
    title: String
}
const Selection: FC<Props> = ({title, sections}) => {
  //maybe make a colored box display depending on 
  return (
    <div>
        <h1>{title}</h1>
        {sections.map((v,i)=>(
            <div>
              <div>
                Course: {v.course}
              </div>
              <div>
                Section: {v.section}
              </div>
              <div>
                Days: {v.days}
              </div>
              <div>
                Meeting Time: {v.start}-{v.end}
              </div>
              <hr/>
            </div>
        ))}
    </div>
  )
}

export default Selection