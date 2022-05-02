import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import contexts, { APIContext } from "../../../Components/APIContext";
import { PreferenceBlock } from "../../../Components/Profile/PreferenceBlock";
import { CourseBlock, Person } from "../../../modules/API";
import { CompressedCourseBlock } from "../../../modules/BlockFunctions";
import { ContextSetterSpy } from "../../helpers/ContextSetterSpy";

jest.mock("../../../modules/API");
jest.mock("../../../Components/APIContext");

describe("PreferenceBlock", () => {
  const course_instance: CourseBlock = {
    department: "CSCE1",
    course_number: 101,
    section_number: "500",
    section_id: 0,
    start_time: new Date(Math.random()),
    end_time: new Date(Math.random() + 7),
    weekday: "W",
    place: "ZACH 420",
    scheduled: [1, 2, 3],
    professor: "Leyk",
    capacity_peer_teachers: 3,
  };

  const data: CompressedCourseBlock = {
    ...course_instance,
    section_numbers: ["501", "502", "503"],
    professors: ["TBA", "Bobby", "Thomas"],
    section_ids: [0, 1, 2],
    locations: ["ZACH", "ZACH", "EABA"],
    scheduledAll: [[55, 56, 57], [0], [59, 60]],
  };

  const person: Person = {
    person_id: 0,
    email: "test1",
    first_name: "A",
    last_name: "B",
    profile_photo_url: "404",
    peer_teacher: false,
    teaching_assistant: false,
    administrator: false,
    professor: false,
    isScheduled: false,
    isChecked: false,
    desired_number_assignments: 0,
  };

  it("shows the course number", () => {
    render(<PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />);
    expect(screen.getByText(`${course_instance.course_number}`)).toBeInTheDocument();
  });

  it('becomes detailed on click', () => {
    render(<PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />);
    screen.getByText(`${course_instance.course_number}`).click();
    data.professors.forEach((p, i) => {
      if (p !== "TBA") expect(screen.getByText(`${data.course_number}-${data.section_numbers[i]} with ${p}`)).toBeInTheDocument();
      else expect(screen.getByText(`${data.course_number}-${data.section_numbers[i]} (professor TBA)`)).toBeInTheDocument();
    })
  });

  it('becomes undetailed on click outside', () => {
    render(<PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />);
    screen.getByText(`${course_instance.course_number}`).click();

    data.professors.forEach((p, i) => {
      if (p !== "TBA") expect(screen.getByText(`${data.course_number}-${data.section_numbers[i]} with ${p}`)).toBeInTheDocument();
      else expect(screen.getByText(`${data.course_number}-${data.section_numbers[i]} (professor TBA)`)).toBeInTheDocument();
    });

    userEvent.click(document.body);
    data.professors.forEach((p, i) => {
      if (p !== "TBA") expect(screen.queryByText(`${data.course_number}-${data.section_numbers[i]} with ${p}`)).not.toBeInTheDocument();
      else expect(screen.queryByText(`${data.course_number}-${data.section_numbers[i]} (professor TBA)`)).not.toBeInTheDocument();
    });
  });

  it("marks sections as can't do", () => {
    const fn = jest.fn();
    render(
      < APIContext >
        < ContextSetterSpy what={contexts.userPrefs} spy={fn} >
          <PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />
        </ContextSetterSpy>
      </APIContext>
    );
    screen.getByText(`${course_instance.course_number}`).click();

    screen.getByText(new RegExp(data.professors[0])).click();
    screen.getByRole('button', {name: "I Can't Do These"}).click();

    expect(fn).toHaveBeenCalled();
  });

  it("marks sections as don't want", () => {
    const fn = jest.fn();
    render(
      < APIContext >
        < ContextSetterSpy what={contexts.userPrefs} spy={fn} >
          <PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />
        </ContextSetterSpy>
      </APIContext>
    );
    screen.getByText(`${course_instance.course_number}`).click();

    screen.getByText(new RegExp(data.professors[0])).click();
    screen.getByRole('button', {name: "I Don't Want These"}).click();

    expect(fn).toHaveBeenCalled();
  });

  it("marks sections as indifferent", () => {
    const fn = jest.fn();
    render(
      < APIContext >
        < ContextSetterSpy what={contexts.userPrefs} spy={fn} >
          <PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />
        </ContextSetterSpy>
      </APIContext>
    );
    screen.getByText(`${course_instance.course_number}`).click();

    screen.getByText(new RegExp(data.professors[0])).click();
    screen.getByRole('button', {name: "No Preference"}).click();

    expect(fn).toHaveBeenCalled();
  });

  it("marks sections as want", () => {
    const fn = jest.fn();
    render(
      < APIContext >
        < ContextSetterSpy what={contexts.userPrefs} spy={fn} >
          <PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />
        </ContextSetterSpy>
      </APIContext>
    );
    screen.getByText(`${course_instance.course_number}`).click();

    screen.getByText(new RegExp(data.professors[0])).click();
    screen.getByRole('button', {name: "I Want These"}).click();

    expect(fn).toHaveBeenCalled();
  });

  it("can select all", () => {
    render(
      < APIContext >
        <PreferenceBlock data={{course_instance: data, linkIDs: null}} visible={false} />
      </APIContext>
    );
    screen.getByText(`${course_instance.course_number}`).click();

    screen.getByText("Select All").click();
    expect(Array.from(document.querySelectorAll(`input[type=checkbox]:checked`)).length).toBe(data.professors.length);
  })
});
