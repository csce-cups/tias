import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ProfileFormRow } from "../../../Components/Profile/ProfileFormRow";

jest.mock("../../../modules/API");
jest.mock("../../../Components/APIContext");

describe("ProfileFormRow", () => {
  it("shows the name", () => {
    render(<ProfileFormRow course_id={-1} course_name={"coursename"} qual={false} />);
    expect(screen.getByText(/coursename/i)).toBeInTheDocument();
  });

  it("states the current qualification (false)", () => {
    render(<ProfileFormRow course_id={-1} course_name={"coursename"} qual={false} />);
    expect(screen.getByText("Will not be scheduled for this course")).toBeInTheDocument();
  });

  it("states the current qualification (true)", () => {
    render(<ProfileFormRow course_id={-1} course_name={"coursename"} qual={true} />);
    expect(screen.getByText("Can be scheduled for this course")).toBeInTheDocument();
  });

  it("updates to true", () => {
    render(<ProfileFormRow course_id={-1} course_name={"coursename"} qual={false}/>);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, {
      target: { value: true }
    });

    expect(screen.getByText("Can be scheduled for this course")).toBeInTheDocument();
  });

  it("updates to false", () => {
    render(<ProfileFormRow course_id={-1} course_name={"coursename"} qual={true}/>);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, {
      target: { value: false }
    });

    expect(screen.getByText("Will not be scheduled for this course")).toBeInTheDocument();
  });
});
