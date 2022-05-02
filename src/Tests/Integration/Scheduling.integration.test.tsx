import { render, screen } from '@testing-library/react';
import contexts, { APIContext } from '../../Components/APIContext';
import { Person } from '../../modules/API';
import { APINoAsync } from '../../modules/__mocks__/API';
import { Scheduling } from '../../pages/Scheduling';

jest.mock('../../Components/APIContext');
jest.mock('../../modules/API');

describe("Scheduling Integration", () => {
  const person: Person = {
    ...APINoAsync.fetchPTList()[0],
    first_name: "John",
    last_name: "Doe",
    peer_teacher: true,
    teaching_assistant: true,
    professor: true,
    administrator: true
  };

  describe("bootstrap page", () => {
    it('has a bootstrap page', () => {
      render(
        <APIContext>
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
            <Scheduling />
          </contexts.user.Provider>
        </APIContext>
      );
  
      expect(screen.getByText(/Generate Schedule/i)).toBeInTheDocument();
    });

    it('says loading while the user loads', () => {
      render(
        <APIContext>
          <Scheduling />
        </APIContext>
      );
  
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("disallows access if the user doesn't have permission", () => {
      render(
        <APIContext>
          < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: false}} >
            <Scheduling />
          </contexts.user.Provider>
        </APIContext>
      );
  
      expect(screen.getByText(/You do not have permission to visit this page./i)).toBeInTheDocument();
    })
  });
});