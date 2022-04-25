import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { SectionEditButton } from '../../../Components/Admin/SectionEditButton';
import contexts, { APIContext } from '../../../Components/APIContext';
import API from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';
import { ContextSetterSpy } from '../../helpers/ContextSetterSpy';

jest.mock('../../../Components/APIContext');
jest.mock('../../../modules/API');

describe("SectionEditButton", () => {
  it("shows a render window when activated", async () => {
    render(
      <APIContext>
        <SectionEditButton/>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('SchedulingWindow')).toBeInTheDocument();
    });

    const exit = screen.getAllByRole("button").filter(b => b.innerHTML === "Exit")[0];
    exit.click();

    await waitFor(() => {
      expect(screen.queryByTestId('SchedulingWindow')).not.toBeInTheDocument();
    });
  });

  it("submits updates to the API", async () => {
    const updateSections = jest.spyOn(API, "updateSections").mockImplementation(() => new Promise(r => r()));
    render(
      <APIContext>
        <SectionEditButton/>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();

    screen.getByText("Save updated sections").click();
    await waitFor(() => {
      expect(updateSections).toHaveBeenCalled();
    });
    updateSections.mockRestore();
  });

  it("warns exit when there are changes (SectionEditBlock dependent)", async () => {
    const confirm = jest.spyOn(window, "confirm").mockImplementation(() => false);
    const block = APINoAsync.fetchCourseBlocks().Monday![0];
    const week = {
      Monday: [block],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    render(
      <APIContext>
        <ContextSetterSpy what={contexts.blocks} value={week}>
          <SectionEditButton/>
        </ContextSetterSpy>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();

    screen.getByText(`${block.course_number} ${block.section_number}`).click();

    const desiredPeerTeachers = screen.getByLabelText(/Desired Peer Teachers/);
    fireEvent.change(desiredPeerTeachers, {target: {value: 5}});

    const exit = screen.getByText("Leave without saving");
    expect(exit).toBeInTheDocument();

    act(() => exit.click());
    
    expect(confirm).toHaveBeenCalled();
  });

  it("doesn't save changes on exit (SectionEditBlock dependent)", async () => {
    const confirm = jest.spyOn(window, "confirm").mockImplementation(() => true);
    const block = APINoAsync.fetchCourseBlocks().Monday![0];
    const week = {
      Monday: [block],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    render(
      <APIContext>
        <ContextSetterSpy what={contexts.blocks} value={week}>
          <SectionEditButton/>
        </ContextSetterSpy>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();

    screen.getByText(`${block.course_number} ${block.section_number}`).click();

    const desiredPeerTeachers = screen.getByLabelText(/Desired Peer Teachers/);
    fireEvent.change(desiredPeerTeachers, {target: {value: 5}});

    const exit = screen.getByText("Leave without saving");
    expect(exit).toBeInTheDocument();
    act(() => exit.click());
    expect(confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByTestId('SchedulingWindow')).not.toBeInTheDocument();
    });
  });

  it("updates on save (SectionEditBlock dependent)", async () => {
    const spy = jest.fn();
    const block = APINoAsync.fetchCourseBlocks().Monday![0];
    const week = {
      Monday: [block],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    render(
      <APIContext>
        <ContextSetterSpy what={contexts.blocks} value={week} spy={spy}>
          <SectionEditButton/>
        </ContextSetterSpy>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();

    screen.getByText(`${block.course_number} ${block.section_number}`).click();

    const desiredPeerTeachers = screen.getByLabelText(/Desired Peer Teachers/);
    fireEvent.change(desiredPeerTeachers, {target: {value: 5}});

    const submit = screen.getByText("Save 1 updated sections");
    expect(submit).toBeInTheDocument();
    act(() => submit.click());

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});