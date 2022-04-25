import React, { FC } from 'react'
import { Course } from '../../../modules/API'

interface Props {
  course: Course
}

export const AdminCourseRow: FC<Props> = ({course}) => {
  return (
    <div className="vstack" data-testid="AdminCourseRow">
      <div>
        {course.department} {course.course_number}
      </div>
      <div>
        {course.course_name} 
      </div>
    </div>
  )
}
