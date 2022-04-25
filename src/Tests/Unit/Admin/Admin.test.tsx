import { render, screen } from '@testing-library/react';
import { Admin } from '../../../Components/Admin/Admin';

jest.mock('../../../Components/Admin/AdminEmployeePanel');
jest.mock('../../../Components/Admin/AdminCoursePanel');

describe("Admin", () => {
  it("renders the employee panel", () => {
    render(<Admin />);
    expect(screen.getByTestId("AdminEmployeePanel")).toBeInTheDocument();
  });

  it("renders the course panel", () => {
    render(<Admin />);
    expect(screen.getByTestId("AdminCoursePanel")).toBeInTheDocument();
  });
});