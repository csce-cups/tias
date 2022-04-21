import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { GenerateButton } from "../../../Components/EmployeeList/GenerateButton";
import contexts, { APIContext } from "../../../Components/APIContext";
import API, { CourseBlockWeek, Person } from "../../../modules/API";
import { ContextSetterSpy } from "../../helpers/ContextSetterSpy";

jest.mock("../../../modules/API");
jest.mock("../../../Components/APIContext");

describe("GenerateButton", () => {
  let employees: Person[];
  let blocks: CourseBlockWeek;
  beforeAll(async () => {
    const promises = API.fetchAllStatic();
    await Promise.all([
      promises.employees.then(_employees => {
        employees = _employees;
      }),

      promises.blocks.then(_blocks => {
        blocks = _blocks;
      })
    ])
  })

  it("should say generate schedule", () => {
    render(<GenerateButton genState={0 as any} />);
    expect(screen.getByText("Generate Schedule")).toBeInTheDocument();
  });

  it("should run the scheduler when clicked", async () => {
    const spy = jest.spyOn(API, "runScheduler");
    render(
      <APIContext>
        <GenerateButton genState={[false, () => {}]} />
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();

    await waitFor(() => { // Required to prevent unmount errors
      expect(screen.getByText("Done generating!")).toBeInTheDocument();
    });
  });

  it("should change it's text while the scheduler runs", async () => {
    render(
      <APIContext>
        <GenerateButton genState={[false, () => {}]} />
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();
    expect(screen.getByText("Generating...")).toBeInTheDocument();

    await waitFor(() => { // Required to prevent unmount errors
      expect(screen.getByText("Done generating!")).toBeInTheDocument();
    });
  });

  it("should change it's text after the scheduler runs", async () => {
    render(
      <APIContext>
        <GenerateButton genState={[false, () => {}]} />
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();
    await waitFor(() => {
      expect(screen.getByText("Done generating!")).toBeInTheDocument();
    });
  });

  it("should present a warning if a schedule is present", () => {
    const spy = jest.spyOn(window, "confirm").mockImplementation(() => false);
    render(
      <APIContext>
        <contexts.loadedSchedule.Provider
          value={[new Map<string, number[]>([["1", [1, 2]]]), () => {}]}
        >
          <GenerateButton genState={[false, () => {}]} />
        </contexts.loadedSchedule.Provider>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  describe("cache updates", () => {
    it("should save the schedule", async () => {
      const fn = jest.fn();
      render(
        <APIContext>
          < ContextSetterSpy what={contexts.loadedSchedule} spy={fn}>
            <GenerateButton genState={[false, () => {}]} />
          </ ContextSetterSpy >
        </APIContext>
      );

      const button = screen.getByRole("button");
      button.click();
      await waitFor(() => { 
        expect(fn).toHaveBeenCalled();
        expect(screen.getByText("Done generating!")).toBeInTheDocument(); // Required to prevent unmount errors
      });
    });

    it("should update the blocks", async () => {
      const fn = jest.fn();
      render(
        <APIContext>
          < ContextSetterSpy what={contexts.blocks} value={blocks} spy={fn}>
            <GenerateButton genState={[false, () => {}]} />
          </ ContextSetterSpy >
        </APIContext>
      );

      const button = screen.getByRole("button");
      button.click();
      await waitFor(() => { 
        expect(fn).toHaveBeenCalled();
        expect(screen.getByText("Done generating!")).toBeInTheDocument(); // Required to prevent unmount errors
      });
    });

    it("should update the employees", async () => {
      const fn = jest.fn();
      render(
        <APIContext>
          < ContextSetterSpy what={contexts.employees} value={employees} spy={fn}>
            <GenerateButton genState={[false, () => {}]} />
          </ ContextSetterSpy >
        </APIContext>
      );

      const button = screen.getByRole("button");
      button.click();
      await waitFor(() => { 
        expect(fn).toHaveBeenCalled();
        expect(screen.getByText("Done generating!")).toBeInTheDocument(); // Required to prevent unmount errors
      });
    });
  })
});
