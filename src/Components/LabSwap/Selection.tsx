import React, { FC } from 'react'
interface CourseInstance{
  department: string
	course_number: number
	section_numbers: Array<number>
	start_time: Date
	end_time: Date
	weekday: string
	place: string
}
interface Section extends CourseInstance{
  valid: boolean
}
interface Props{
    sections: Section
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
      <hr/>
    </div>
  );
  if(sections.valid){
    info=(<div>
    <p>
      Course: {sections.course_number}
    </p>
    <p>
      Section: {sections.section_numbers[0]}
    </p>
    <p>
      Meeting Time: {"gonna get better output"}
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

