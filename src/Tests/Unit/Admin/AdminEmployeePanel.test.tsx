import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { AdminEmployeePanel } from '../../../Components/Admin/AdminEmployeePanel';
import contexts, { APIContext } from '../../../Components/APIContext';
import API, { Person } from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';
import { ContextSetterSpy } from '../../helpers/ContextSetterSpy';

jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/Admin/AdminEmployee');
jest.mock('../../../modules/API');

describe("AdminEmployeePanel", () => {
  const everyone = APINoAsync.fetchEveryone();
  const renderSubject = () => render(
    <APIContext>
      <ContextSetterSpy what={contexts.employees} value={everyone} spy={jest.fn()}>
        <AdminEmployeePanel />
      </ContextSetterSpy>
    </APIContext>
  )

  it("renders the employees", async () => {
    renderSubject();
    await waitFor(() => {
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    })
  });

  describe("sorting", () => {
    it("sorts by last name by default", async () => {
      renderSubject();
  
      await waitFor(() => { // Wait for it to load
        expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
      });
  
      const displayed = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
      const expected = everyone.sort((a, b) => a.last_name.localeCompare(b.last_name)).map(employee => `${employee.first_name} ${employee.last_name}`);
      expect(displayed).toEqual(expected);
    });
  
    it('sorts by first name when selected', async () => {
      renderSubject();
  
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
      renderSubject();
  
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
  
      renderSubject();
  
      await waitFor(() => { // Wait for it to load
        expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
      });
  
      const sortByRole = screen.getByText('Role');
      sortByRole.click();
  
      const displayed = screen.getAllByText(/[A-Z]-Test [A-Z]-User [0-9]+/m).map(node => node.innerHTML);
      const expected = everyone.sort(roleSort).map(employee => `${employee.first_name} ${employee.last_name}`);
      expect(displayed).toEqual(expected);
    })
  })

  describe("new user", () => {
    it("has a menu that collapses and uncollapses on click", async () => {
      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      expect(registerButton).toBeInTheDocument();
    });

    it("rejects empty forms", async () => {
      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      await waitFor(() => {
        const btntxt = screen.getByText('You must specify a first name, last name, and an email');
        expect(btntxt).toBeInTheDocument();
      })
    })

    it("rejects bad first names", async () => {
      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const fnameField = screen.getByPlaceholderText("First Name");
      fireEvent.change(fnameField, {target: {value: "Test123"}});

      const lnameField = screen.getByPlaceholderText("Last Name");
      fireEvent.change(lnameField, {target: {value: "User"}});

      const emailField = screen.getByPlaceholderText("email@tamu.edu");
      fireEvent.change(emailField, {target: {value: "test_user@tamu.edu"}});

      const checkBoxes = screen.getAllByRole('checkbox').filter(box => box.id.includes('register'));
      checkBoxes.forEach(box => box.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      await waitFor(() => {
        const btntxt = screen.getByText('"Test123" is not a valid name');
        expect(btntxt).toBeInTheDocument();
      })
    })

    it("rejects bad first names", async () => {
      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const fnameField = screen.getByPlaceholderText("First Name");
      fireEvent.change(fnameField, {target: {value: "Test"}});

      const lnameField = screen.getByPlaceholderText("Last Name");
      fireEvent.change(lnameField, {target: {value: "User123"}});

      const emailField = screen.getByPlaceholderText("email@tamu.edu");
      fireEvent.change(emailField, {target: {value: "test_user@tamu.edu"}});

      const checkBoxes = screen.getAllByRole('checkbox').filter(box => box.id.includes('register'));
      checkBoxes.forEach(box => box.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      await waitFor(() => {
        const btntxt = screen.getByText('"User123" is not a valid name');
        expect(btntxt).toBeInTheDocument();
      })
    });

    it("rejects non-tamu emails", async () => {
      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const fnameField = screen.getByPlaceholderText("First Name");
      fireEvent.change(fnameField, {target: {value: "Test"}});

      const lnameField = screen.getByPlaceholderText("Last Name");
      fireEvent.change(lnameField, {target: {value: "User"}});

      const emailField = screen.getByPlaceholderText("email@tamu.edu");
      fireEvent.change(emailField, {target: {value: "test_user@test.edu"}});

      const checkBoxes = screen.getAllByRole('checkbox').filter(box => box.id.includes('register'));
      checkBoxes.forEach(box => box.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      await waitFor(() => {
        const btntxt = screen.getByText('"test_user@test.edu" is not a valid @tamu.edu email');
        expect(btntxt).toBeInTheDocument();
      })
    });

    it("asks for confirmation when adding an admin", () => {
      const confirm = jest.spyOn(window, 'confirm').mockImplementation(() => false);
      const spy = jest.spyOn(API, 'registerNewUser').mockImplementation(() => new Promise(r => r()));

      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const fnameField = screen.getByPlaceholderText("First Name");
      fireEvent.change(fnameField, {target: {value: "Test"}});

      const lnameField = screen.getByPlaceholderText("Last Name");
      fireEvent.change(lnameField, {target: {value: "User"}});

      const emailField = screen.getByPlaceholderText("email@tamu.edu");
      fireEvent.change(emailField, {target: {value: "test_user@tamu.edu"}});

      const checkBoxes = screen.getAllByRole('checkbox').filter(box => box.id.includes('register'));
      checkBoxes.forEach(box => box.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      expect(confirm).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it("can register new users", () => {
      jest.spyOn(window, 'confirm').mockImplementation(() => true);
      const spy = jest.spyOn(API, 'registerNewUser').mockImplementation(() => new Promise((res, rej) => rej()));

      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const fnameField = screen.getByPlaceholderText("First Name");
      fireEvent.change(fnameField, {target: {value: "Test"}});

      const lnameField = screen.getByPlaceholderText("Last Name");
      fireEvent.change(lnameField, {target: {value: "User"}});

      const emailField = screen.getByPlaceholderText("email@tamu.edu");
      fireEvent.change(emailField, {target: {value: "test_user@tamu.edu"}});

      const checkBoxes = screen.getAllByRole('checkbox').filter(box => box.id.includes('register'));
      checkBoxes.forEach(box => box.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      expect(spy).toHaveBeenCalled();
    });

    it("updates the button on submit", async () => {
      jest.spyOn(window, 'confirm').mockImplementation(() => true);
      const spy = jest.spyOn(API, 'registerNewUser').mockImplementation(() => new Promise(r => setTimeout(() => r(), 10)));
      jest.spyOn(API, 'fetchEveryone').mockImplementation(() => new Promise(r => r(APINoAsync.fetchEveryone())));

      renderSubject();
      const dropdown = screen.getByText("Register New User");
      act(() => dropdown.click());

      const fnameField = screen.getByPlaceholderText("First Name");
      fireEvent.change(fnameField, {target: {value: "Test"}});

      const lnameField = screen.getByPlaceholderText("Last Name");
      fireEvent.change(lnameField, {target: {value: "User"}});

      const emailField = screen.getByPlaceholderText("email@tamu.edu");
      fireEvent.change(emailField, {target: {value: "test_user@tamu.edu"}});

      const checkBoxes = screen.getAllByRole('checkbox').filter(box => box.id.includes('register'));
      checkBoxes.forEach(box => box.click());

      const registerButton = screen.getByRole('button', {name: 'Register'});
      registerButton.click();
      
      expect(spy).toHaveBeenCalled();
      expect(screen.getByText('Registering...')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByText('Updating list...')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Done!')).toBeInTheDocument();
      });

      await act(async () => { // Required to clean up the test
        await new Promise<void>(res => setTimeout(() => {
          screen.getByText("Register New User").click();
          res();
        }, 2));
      })
      
      await waitForElementToBeRemoved(screen.getByRole('button', {name: 'Done!'}));
    })
  });
});