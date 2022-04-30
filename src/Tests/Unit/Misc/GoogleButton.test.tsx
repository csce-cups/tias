import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import contexts, { APIContext } from "../../../Components/APIContext";
import { GoogleButton } from "../../../Components/Misc/GoogleButton";
import { APINoAsync } from "../../../modules/__mocks__/API";

jest.mock("../../../Components/APIContext");

describe("GoogleButton", () => {
  it("should say Sign in with Google when not signed in", () => {
    render(
      <APIContext>
        <Router>
          <GoogleButton />
        </Router>
      </APIContext>
    );
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("should say Logged in as when logged in", () => {
    const person = APINoAsync.fetchPTList()[0];
    render(
      <APIContext>
        < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}}>
          <Router>
            <GoogleButton />
          </Router>
        </contexts.user.Provider>
      </APIContext>
    );
    expect(screen.getByText(`Logged in as ${person.first_name}. Click to sign out.`)).toBeInTheDocument();
  });
});
