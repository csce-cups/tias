import {screen, render} from '@testing-library/react';
import { AdminEmployee } from '../../../Components/Admin/AdminEmployee';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../Components/Admin/AdminEmployeeDetail');

describe("AdminEmployee", () => {
  const employee = APINoAsync.fetchEveryone()[0];
  
  it("displays an employee's first and last name", () => {
    render(<AdminEmployee employee={employee} setEmployee={() => {}}/>);
    expect(screen.getByText(`${employee.first_name} ${employee.last_name}`)).toBeInTheDocument();
  });

  it("displays an employee's email", () => {
    render(<AdminEmployee employee={employee} setEmployee={() => {}}/>);
    expect(screen.getByText("("+employee.email+")")).toBeInTheDocument();
  });
})