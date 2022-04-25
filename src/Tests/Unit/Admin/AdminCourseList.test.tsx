import {screen, render, waitFor} from '@testing-library/react';
import { AdminCourseList } from '../../../Components/Admin/AdminCourseList';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../modules/API');
jest.mock('../../../Components/Admin/AdminCourseRow');

describe("AdminCourseList", () => {
  const courses = APINoAsync.getCourses();
  it("renders each course", async () => {
    render(<AdminCourseList />);
    await waitFor(() => {
      courses.forEach(c => {
        expect(screen.getByText(`${c.department} ${c.course_number}`)).toBeInTheDocument();
      });
    })
  })
})