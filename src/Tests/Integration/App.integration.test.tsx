import { render, screen } from '@testing-library/react';
import { Person } from '../../modules/API';
import { APINoAsync } from '../../modules/__mocks__/API';
import { App } from '../../pages/App';

jest.mock('../../Components/APIContext');
jest.mock('../../modules/API');

describe("Profile Integration", () => {
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
    it('exists', () => {
      render(<App />);
  
      expect(screen.getByText(/TIAS/i)).toBeInTheDocument();
    });
  });
});