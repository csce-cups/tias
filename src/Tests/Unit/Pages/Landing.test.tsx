import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from "react-router-dom";
import contexts, { APIContext } from '../../../Components/APIContext';
import { Person } from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';
import Landing from '../../../pages/Landing';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe("Landing", () => {
  let person: Person;
  
  beforeEach(() => {
    person = {
      ...APINoAsync.fetchPTList()[0],
      peer_teacher: true,
      teaching_assistant: true,
      professor: true,
      administrator: true
    };
  })

  it("asks the user to sign in if not signed in", () => {
    render(
      < APIContext >
        <Router>
          <Landing />
        </Router>
      </APIContext>
    );

    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("tells the user when they have nothing to do", () => {
    person.peer_teacher = false;
    person.administrator = false;
    render(
      < APIContext >
        < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
          <Router>
            <Landing />
          </Router>
        </contexts.user.Provider>
      </APIContext>
    );

    expect(screen.getByText("You don't have any available actions associated with your account.")).toBeInTheDocument();
  });

  it("says start scheduling if they're an admin", () => {
    render(
      < APIContext >
        < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
          <Router>
            <Landing />
          </Router>
        </contexts.user.Provider>
      </APIContext>
    );

    expect(screen.getByText("Start Scheduling")).toBeInTheDocument();
  });

  it("says start scheduling if they're an admin", () => {
    person.administrator = false;
    render(
      < APIContext >
        < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
          <Router>
            <Landing />
          </Router>
        </contexts.user.Provider>
      </APIContext>
    );

    expect(screen.getByText("View Profile")).toBeInTheDocument();
  });
})