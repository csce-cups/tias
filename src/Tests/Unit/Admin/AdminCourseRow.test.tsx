import { screen, render, fireEvent } from '@testing-library/react';
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

  it("gives warning for deletion", () => {
    render(<AdminCourseRow course={course} isEditing={true} deleteSelf={() => {}} isBottom={false}/>);
    screen.getByText("Delete").click();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
  });

  it("allows deletion", () => {
    const deleteSelf = jest.fn();
    render(<AdminCourseRow course={course} isEditing={true} deleteSelf={deleteSelf} isBottom={false}/>);
    screen.getByText("Delete").click();
    
    const confirmField = screen.getByPlaceholderText(`Type ${course.course_number} to confirm`);
    fireEvent.change(confirmField, {target: {value: course.course_number.toString()}});
    screen.getByText("Delete").click();

    expect(deleteSelf).toHaveBeenCalled();
  })
})