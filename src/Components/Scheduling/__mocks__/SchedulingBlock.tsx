import React, { FC } from 'react';
import { CourseBlock } from '../../../modules/API';
import RenderBlockProps from '../BlockBase';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CourseBlock
    linkIDs: number[] | null
  }
}

export const SchedulingBlock: FC<Props> = (({data}) => {
  const {course_instance} = data;
  return (
    <div data-testid={course_instance.section_id}>{course_instance.course_number}-{course_instance.section_number}</div>
  )
})