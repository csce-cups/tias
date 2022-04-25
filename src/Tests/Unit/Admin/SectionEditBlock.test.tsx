import {screen, render, fireEvent} from '@testing-library/react';
import { SectionEditBlock } from '../../../Components/Admin/SectionEditBlock';
import { toUpdateContext } from '../../../Components/Admin/SectionEditButton';
import { CourseBlock } from '../../../modules/API';

jest.mock('../../../Components/Admin/SectionEditButton');

describe("SectionEditBlock", () => {
  const cb: CourseBlock = {
    department: "CSCE",
    course_number: 100,
    section_number: "501",
    section_id: 1,
    start_time: new Date((8+6)*60*60*1000),
    end_time: new Date((8+6)*60*60*1000 + 50*60*1000),
    weekday: "Monday",
    place: "BUILDING A",
    scheduled: [],
    ronly_scheduled: [],
    professor: "Abby",
    capacity_peer_teachers: 1
  };

  describe("standard view", () => {
    it("displays the course", () => {
      render(<SectionEditBlock data={{course_instance: cb}} visible={true}/>);
      expect(screen.getAllByText(new RegExp(cb.course_number.toString())).length).toBeGreaterThan(0);
    })
  })

  describe("editing", () => {
    it("becomes detailed on click", () => {
      render(<SectionEditBlock data={{course_instance: cb}} visible={true}/>);
      screen.getAllByText(new RegExp(`${cb.section_number}`))[0].click();
      expect(screen.getByText(`Edit ${cb.department} ${cb.course_number} section ${cb.section_number}`)).toBeInTheDocument();
    });

    it("accepts desired number of peer teachers", () => {
      const sectionUpdate = jest.fn();
      const editCount = jest.fn();
      render(
        < toUpdateContext.Provider value={[
          [], sectionUpdate,
          0, editCount
        ]}>
          <SectionEditBlock data={{course_instance: cb}} visible={true}/>
        </ toUpdateContext.Provider >
      );
      screen.getAllByText(new RegExp(`${cb.section_number}`))[0].click();
      const desiredPeerTeachers = screen.getByLabelText(/Desired Peer Teachers/);
      fireEvent.change(desiredPeerTeachers, {target: {value: 5}});

      expect(editCount).toHaveBeenCalledWith(1);
      expect(sectionUpdate).toHaveBeenCalled();
    })

    it("accepts the professor", () => {
      const sectionUpdate = jest.fn();
      const editCount = jest.fn();
      render(
        < toUpdateContext.Provider value={[
          [], sectionUpdate,
          0, editCount
        ]}>
          <SectionEditBlock data={{course_instance: cb}} visible={true}/>
        </ toUpdateContext.Provider >
      );
      screen.getAllByText(new RegExp(`${cb.section_number}`))[0].click();
      const profField = screen.getByLabelText(/Professor/) as HTMLInputElement;
      fireEvent.change(profField, {target: {value: "Abby"}});

      expect(profField.value).toBe("Abby");
    });

    it("can have it's changes reverted", () => {
      const sectionUpdate = jest.fn();
      const editCount = jest.fn();
      render(
        < toUpdateContext.Provider value={[
          [], sectionUpdate,
          0, editCount
        ]}>
          <SectionEditBlock data={{course_instance: cb}} visible={true}/>
        </ toUpdateContext.Provider >
      );
      screen.getAllByText(new RegExp(`${cb.section_number}`))[0].click();
      const desiredPeerTeachers = screen.getByLabelText(/Desired Peer Teachers/);
      fireEvent.change(desiredPeerTeachers, {target: {value: 5}});

      expect(editCount).toHaveBeenCalledWith(1);
      expect(sectionUpdate).toHaveBeenCalled();
      
      const revertButton = screen.getByText(/Revert/);
      revertButton.click();

      expect(sectionUpdate).toHaveBeenCalled();
    })
  })
})