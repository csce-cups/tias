import React, { FC } from 'react'
import { CompressedCourseBlock } from '../../modules/BlockManipulation'


interface Section extends CompressedCourseBlock {
  valid: boolean
}

interface Props {
  sections: Section
  title: string
}

export const Selection: FC<Props> = ({title, sections}) => {
  //maybe make a colored box display depending on
  let info = (
    <>
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
    </>
  );

  if (sections.valid) {
    info = (
      <>
        <p>
          Course: {sections.course_number}
        </p>
        <p>
          Section: {sections.section_numbers[0]}
        </p>
        <p>
          Meeting Time: {sections.start_time.toLocaleTimeString()}-{sections.end_time.toLocaleTimeString()}
        </p>
        <hr/>
      </>
    )
  }

  return (
    <div style={{width:"12vw"}}>
      <h1>{title}</h1>
      <div>{info}</div>
    </div>
  )
}

