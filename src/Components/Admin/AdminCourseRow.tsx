import React, { FC, useEffect, useRef } from "react";
import { Course, CourseBlock } from "../../modules/API";

interface Props {
  course: Course
  isEditing: boolean
}

export const AdminCourseRow: FC<Props> = ({course, isEditing}) => {
  return (
    <div className="course-row hstack">
      <div className="vstack">
        <div>
          {course.department} {course.course_number}
        </div>
        <div>
          {course.course_name} 
        </div>
      </div>
      <div className="fill"/>
      <button className={`red button course-delete ${!isEditing? 'hidden' : ''}`}>Delete</button>
    </div>
  );
};
