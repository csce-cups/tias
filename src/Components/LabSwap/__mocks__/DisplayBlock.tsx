import React, { FC } from 'react';
import { CourseBlock, Person } from '../../../modules/API';
import RenderBlockProps from '../../Scheduling/BlockBase';


type shortday = 'M' | 'T' | 'W' | 'R' | 'F';
interface DisplayBlock extends CourseBlock {
  days: (shortday)[]
}

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock | null | undefined
    person: Person | null | undefined
    shift: boolean
  }
}

export const DisplayBlock: FC<Props> = ({visible, size, inline, data}) => {
 

  return (
    <div data-testid={JSON.stringify(data.course_instance)}/>
  )
}
