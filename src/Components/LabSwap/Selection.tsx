import React, { FC } from 'react'
import { CompressedCourseBlock } from '../../modules/BlockManipulation'




interface Props {
  title: string
}

export const Selection: FC<Props> = ({title}) => {
  //maybe make a colored box display depending on
  let info = (
    <>
      <p>
        Course: TBD
      </p>
      <p>
        Section:TBD
      </p>
      <p>
        Meeting Time: TBD!
      </p>
    </>
  );

  

  return (
    <div style={{width:"12vw"}}>
      <h1>{title}</h1>
      <div>{info}</div>
    </div>
  )
}

