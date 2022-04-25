import { screen, render } from '@testing-library/react';
import { AdminCourseRow } from '../../../Components/Admin/AdminCourseRow';
import { Course } from '../../../modules/API';

describe("AdminCourseRow", () => {
  const course: Course = {
    course_id: 1,
    department: "CSCE",
    course_number: "100",
    course_name: "Course Name",
  }

  it("displays the department and course number", () => {
    render(<AdminCourseRow course={course} isEditing={false} deleteSelf={() => {}} isBottom={false}/>);
    expect(screen.getByText(`${course.department} ${course.course_number}`)).toBeInTheDocument();
  });

  it("displays the course name", () => {
    render(<AdminCourseRow course={course} isEditing={false} deleteSelf={() => {}} isBottom={false}/>);
    expect(screen.getByText(course.course_name)).toBeInTheDocument();
  });
})