import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { NavBar } from "../../../Components/Misc/NavBar";
import { MemoryRouter as Router } from "react-router-dom";
import contexts from "../../../Components/APIContext";
import { APINoAsync } from "../../../modules/__mocks__/API";
import { Person } from "../../../modules/API";

jest.mock("../../../modules/API");
jest.mock("../../../Components/APIContext");

describe("Navbar", () => {
  const person: Person = {
    ...APINoAsync.fetchPTList()[0],
    peer_teacher: true,
    teaching_assistant: true,
    professor: true,
    administrator: true,
  };

  it("has all the links", () => {
    render(
      < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
        <Router>
          <NavBar />
        </Router>
      </contexts.user.Provider>
    );
    expect(screen.getByText("TIAS")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Scheduling")).toBeInTheDocument();
    expect(screen.getByText("LabSwap™")).toBeInTheDocument();
  });

  it("should link to the proper pages", () => {
    render(
      < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
        <Router>
          <NavBar />
        </Router>
      </contexts.user.Provider>
    );
    expect(screen.getByText("TIAS")).toHaveAttribute("href", "/");
    expect(screen.getByText("Profile")).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Scheduling")).toHaveAttribute("href", "/scheduling");
    expect(screen.getByText("LabSwap™")).toHaveAttribute("href", "/labswap");
  });
});
