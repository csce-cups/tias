import { render, screen, waitFor } from '@testing-library/react';
import { AdminEmployeePanel } from '../../../Components/Admin/AdminEmployeePanel';
import { APIContext } from '../../../Components/APIContext';
import { Person } from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/Admin/AdminEmployee');
jest.mock('../../../modules/API');

describe("AdminEmployeePanel", () => {
  let everyone = APINoAsync.fetchEveryone();
  it("renders the employees", async () => {
    render(
      <APIContext>
        <AdminEmployeePanel />
      </APIContext>
    );
    await waitFor(() => {
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    })
  });

  it("sorts by last name by default", async () => {
    render(
      <APIContext>
        <AdminEmployeePanel />
      </APIContext>
    );

    await waitFor(() => { // Wait for it to load
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    });

    const displayed = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
    const expected = everyone.sort((a, b) => a.last_name.localeCompare(b.last_name)).map(employee => `${employee.first_name} ${employee.last_name}`);
    expect(displayed).toEqual(expected);
  });

  it('sorts by first name when selected', async () => {
    render(
      <APIContext>
        <AdminEmployeePanel />
      </APIContext>
    );

    await waitFor(() => { // Wait for it to load
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    });

    const sortByFirstName = screen.getByText('First Name');
    sortByFirstName.click();

    const displayed = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
    const expected = everyone.sort((a, b) => a.first_name.localeCompare(b.first_name)).map(employee => `${employee.first_name} ${employee.last_name}`);
    expect(displayed).toEqual(expected);
  });

  it('sorts by last name when selected (requires above test)', async () => {
    render(
      <APIContext>
        <AdminEmployeePanel />
      </APIContext>
    );

    await waitFor(() => { // Wait for it to load
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    });

    const sortByFirstName = screen.getByText('First Name');
    sortByFirstName.click();

    const displayed = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
    const expected = everyone.sort((a, b) => a.first_name.localeCompare(b.first_name)).map(employee => `${employee.first_name} ${employee.last_name}`);
    expect(displayed).toEqual(expected);

    const sortByLastName = screen.getByText('Last Name');
    sortByLastName.click();

    const displayed2 = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
    const expected2 = everyone.sort((a, b) => a.last_name.localeCompare(b.last_name)).map(employee => `${employee.first_name} ${employee.last_name}`);
    expect(displayed2).toEqual(expected2);
  });

  it('sorts by role when selected', async () => {
    const roleSort = ((a: Person, b: Person) => {
      if (a.administrator && !b.administrator) return -1;
      else if (!a.administrator && b.administrator) return 1;
      else if (a.professor && !b.professor) return -1;
      else if (!a.professor && b.professor) return 1;
      else if (a.teaching_assistant && !b.teaching_assistant) return -1;
      else if (!a.teaching_assistant && b.teaching_assistant) return 1;
      else if (a.peer_teacher && !b.peer_teacher) return -1;
      else if (!a.peer_teacher && b.peer_teacher) return 1;
      else return a.last_name.localeCompare(b.last_name);
    });

    render(
      <APIContext>
        <AdminEmployeePanel />
      </APIContext>
    );

    await waitFor(() => { // Wait for it to load
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    });

    const sortByRole = screen.getByText('Role');
    sortByRole.click();

    const displayed = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
    const expected = everyone.sort(roleSort).map(employee => `${employee.first_name} ${employee.last_name}`);
    expect(displayed).toEqual(expected);
  })

});