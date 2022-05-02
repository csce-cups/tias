import { render, screen, waitFor } from '@testing-library/react';
import { TutorialModal } from '../../../Components/Misc/TutorialModal';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe('TutorialModal', () => {
  it("expands on click", () => {
    render(< TutorialModal />);
    screen.getByText("?").click();
    expect(screen.getByText(/close/i)).toBeInTheDocument();
  });

  it("closes when close is clicked", async () => {
    render(< TutorialModal />);
    screen.getByText("?").click();
    expect(screen.getByText(/close/i)).toBeInTheDocument();
    screen.getByText(/close/i).click();

    await waitFor(() => {
      expect(screen.queryByText(/close/i)).not.toBeInTheDocument();
    });
  });

  describe("different pages", () => {
    beforeEach(() => {
      const mockResponse = jest.fn();
      Object.defineProperty(window, "location", {
        value: {
          hash: {
            endsWith: mockResponse,
            includes: mockResponse
          },
          assign: mockResponse
        },
        writable: true
      });
    });

    it("has a tutorial for the scheduling page", () => {
      window.location.pathname = "/scheduling";
      render(< TutorialModal />);
      screen.getByText("?").click();
      expect(screen.getByText(/close/i)).toBeInTheDocument();
    });
  
    it("has a tutorial for the profile page", () => {
      window.location.pathname = "/profile";
      render(< TutorialModal />);
      screen.getByText("?").click();
      expect(screen.getByText(/close/i)).toBeInTheDocument();
    });
  
    it("has a tutorial for the labswap page", () => {
      window.location.pathname = "/labswap";
      render(< TutorialModal />);
      screen.getByText("?").click();
      expect(screen.getByText(/close/i)).toBeInTheDocument();
    });
   
    it("has a tutorial for the admin page", () => {
      window.location.pathname = "/admin";
      render(< TutorialModal />);
      screen.getByText("?").click();
      expect(screen.getByText(/close/i)).toBeInTheDocument();
    });
  });
});