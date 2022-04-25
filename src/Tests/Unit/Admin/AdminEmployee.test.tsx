import {screen, render, waitFor} from '@testing-library/react';
import { AdminEmployee } from '../../../Components/Admin/AdminEmployee';
import API from '../../../modules/API';
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

  it("updates a user's roles", () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const udpateUser = jest.spyOn(API, 'updateUser').mockImplementation(() => Promise.reject());
    render(<AdminEmployee employee={employee} setEmployee={jest.fn()}/>);

    const boxes = screen.getAllByRole("checkbox");
    boxes.forEach(box => box.click());

    const updateUser = screen.getByText("Update user");
    updateUser.click();

    expect(udpateUser).toHaveBeenCalled();
  });

  it("updates the cache", async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(API, 'updateUser').mockImplementation(() => Promise.resolve());
    const setEmployee = jest.fn();
    render(<AdminEmployee employee={employee} setEmployee={setEmployee}/>);

    const boxes = screen.getAllByRole("checkbox");
    boxes.forEach(box => box.click());

    const updateUser = screen.getByText("Update user");
    updateUser.click();

    await waitFor(() => {
      expect(setEmployee).toHaveBeenCalled();
    })
  });

  it("shows failure on user delete", async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const deleteUser = jest.spyOn(API, 'deleteUser').mockImplementation(() => Promise.reject());
    render(<AdminEmployee employee={employee} setEmployee={jest.fn()}/>);

    const deleteUserButton = screen.getByText("Delete user");
    deleteUserButton.click();

    expect(deleteUser).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("An error occurred.")).toBeInTheDocument();
    })
  });

  it("deletes users", async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const deleteUser = jest.spyOn(API, 'deleteUser').mockImplementation(() => Promise.resolve());
    const setEmployee = jest.fn();
    render(<AdminEmployee employee={employee} setEmployee={setEmployee}/>);

    const deleteUserButton = screen.getByText("Delete user");
    deleteUserButton.click();

    expect(deleteUser).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("Deleted!")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(setEmployee).toBeCalledWith(null);
    }, {timeout: 1500});
  });
})