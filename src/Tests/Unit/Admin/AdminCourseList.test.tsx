import {screen, render, waitFor, fireEvent} from '@testing-library/react';
import { AdminCourseList } from '../../../Components/Admin/AdminCourseList';
import API, { Course } from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../modules/API');
jest.mock('../../../Components/Admin/AdminCourseRow');

interface Props {
  course: Course
  isEditing: boolean
  deleteSelf: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  isBottom: boolean
}
let isEditing: boolean;
jest.mock("../../../Components/Admin/AdminCourseRow", () => {
  return {
      __esModule: true,
      AdminCourseRow: (props: Props) => {
          isEditing = props.isEditing;
          return <div className="vstack" data-testid="AdminCourseRow">
          <div>
            {props.course.department} {props.course.course_number}
          </div>
          <div>
            {props.course.course_name} 
          </div>
          <button onClick={props.deleteSelf}>Delete</button>
        </div>
      }
  }
});

describe("AdminCourseList", () => {
  const courses = APINoAsync.getCourses();

  afterEach(() => {
    jest.resetAllMocks();
  })

  it("renders each course", async () => {
    render(<AdminCourseList />);
    await waitFor(() => {
      courses.forEach(c => {
        expect(screen.getByText(`${c.department} ${c.course_number}`)).toBeInTheDocument();
      });
    })
  });

  describe("deleting courses", () => {
    it("shows the delete buttons when edit courses is pressed", () => {
      render(<AdminCourseList />);
      screen.getByText("Edit Courses").click();
      expect(isEditing).toBe(true);
    });

    it("deletes a course when told to by a child component", () => {
      const spy = jest.spyOn(API, "deleteCourse").mockImplementation(() => new Promise(r => r()));
      render(<AdminCourseList />);
      screen.getAllByText("Delete")[0].click();
      expect(spy).toHaveBeenCalled();
    })
  })

  describe("adding courses", () => {
    it("creates a menu when add course is clicked", async () => {
      render(<AdminCourseList />);
      screen.getByText("Add Course").click();
      await waitFor(() => {
        expect(screen.getByText("Save")).toBeInTheDocument();
      });
    })

    it("validates department", () => {
      const spy = jest.spyOn(API, 'addCourse').mockImplementation(() => new Promise((res, rej) => res()));

      render(<AdminCourseList />);
      screen.getByText("Add Course").click();

      const deptField = screen.getByPlaceholderText("Department");
      fireEvent.change(deptField, {target: {value: "Banana"}});

      const coursenumField = screen.getByPlaceholderText("Course Number");
      fireEvent.change(coursenumField, {target: {value: "100"}});

      const cnameField = screen.getByPlaceholderText("Course Name");
      fireEvent.change(cnameField, {target: {value: "A new programming course"}});

      const registerButton = screen.getByRole('button', {name: 'Save'});
      registerButton.click();
      
      expect(screen.getByText("Department must be 4 capital letters (ie. CSCE)")).toBeInTheDocument();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("validates course number", () => {
      const spy = jest.spyOn(API, 'addCourse').mockImplementation(() => new Promise((res, rej) => res()));

      render(<AdminCourseList />);
      screen.getByText("Add Course").click();

      const deptField = screen.getByPlaceholderText("Department");
      fireEvent.change(deptField, {target: {value: "CSCE"}});

      const coursenumField = screen.getByPlaceholderText("Course Number");
      fireEvent.change(coursenumField, {target: {value: "Banana"}});

      const cnameField = screen.getByPlaceholderText("Course Name");
      fireEvent.change(cnameField, {target: {value: "A new programming course"}});

      const registerButton = screen.getByRole('button', {name: 'Save'});
      registerButton.click();
      
      expect(screen.getByText("Course number must be a number")).toBeInTheDocument();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("validates course name", () => {
      const spy = jest.spyOn(API, 'addCourse').mockImplementation(() => new Promise((res, rej) => res()));

      render(<AdminCourseList />);
      screen.getByText("Add Course").click();

      const deptField = screen.getByPlaceholderText("Department");
      fireEvent.change(deptField, {target: {value: "CSCE"}});

      const coursenumField = screen.getByPlaceholderText("Course Number");
      fireEvent.change(coursenumField, {target: {value: "100"}});

      const cnameField = screen.getByPlaceholderText("Course Name");
      fireEvent.change(cnameField, {target: {value: ""}});

      const registerButton = screen.getByRole('button', {name: 'Save'});
      registerButton.click();
      
      expect(screen.getByText("Course name must be at least 1 character")).toBeInTheDocument();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("can add new courses", () => {
      const spy = jest.spyOn(API, 'addCourse').mockImplementation(() => new Promise((res, rej) => res()));

      render(<AdminCourseList />);
      screen.getByText("Add Course").click();

      const deptField = screen.getByPlaceholderText("Department");
      fireEvent.change(deptField, {target: {value: "CSCE"}});

      const coursenumField = screen.getByPlaceholderText("Course Number");
      fireEvent.change(coursenumField, {target: {value: "100"}});

      const cnameField = screen.getByPlaceholderText("Course Name");
      fireEvent.change(cnameField, {target: {value: "A new programming course"}});

      const registerButton = screen.getByRole('button', {name: 'Save'});
      registerButton.click();
      
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it("updates the button when adding new courses", async () => {
      const addCourse = jest.spyOn(API, 'addCourse').mockImplementation(() => new Promise((res, rej) => setTimeout(() => res(), 100)));
      const getCourses = jest.spyOn(API, 'getCourses').mockImplementation(() => new Promise((res, rej) => setTimeout(() => res(courses), 100)));

      render(<AdminCourseList />);
      screen.getByText("Add Course").click();

      const deptField = screen.getByPlaceholderText("Department");
      fireEvent.change(deptField, {target: {value: "CSCE"}});

      const coursenumField = screen.getByPlaceholderText("Course Number");
      fireEvent.change(coursenumField, {target: {value: "100"}});

      const cnameField = screen.getByPlaceholderText("Course Name");
      fireEvent.change(cnameField, {target: {value: "A new programming course"}});

      const registerButton = screen.getByRole('button', {name: 'Save'});
      registerButton.click();
      
      expect(addCourse).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText("Updating list...")).toBeInTheDocument();
      });

      expect(getCourses).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText("Done!")).toBeInTheDocument();
      })

      addCourse.mockRestore();
      getCourses.mockRestore();
    })

    it("handles addCourse errors", async () => {
      const addCourse = jest.spyOn(API, 'addCourse').mockImplementation(() => new Promise((res, rej) => setTimeout(() => rej(), 100)));
      const getCourses = jest.spyOn(API, 'getCourses').mockImplementation(() => new Promise((res, rej) => setTimeout(() => res(courses), 100)));

      render(<AdminCourseList />);
      screen.getByText("Add Course").click();

      const deptField = screen.getByPlaceholderText("Department");
      fireEvent.change(deptField, {target: {value: "CSCE"}});

      const coursenumField = screen.getByPlaceholderText("Course Number");
      fireEvent.change(coursenumField, {target: {value: "100"}});

      const cnameField = screen.getByPlaceholderText("Course Name");
      fireEvent.change(cnameField, {target: {value: "A new programming course"}});

      const registerButton = screen.getByRole('button', {name: 'Save'});
      registerButton.click();
      
      expect(addCourse).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText("An error occurred.")).toBeInTheDocument();
      });
    })
  });
});