import {screen, render} from '@testing-library/react';
import { SectionEditBlock } from '../../../Components/Admin/SectionEditBlock';
import { CourseBlock } from '../../../modules/API';

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
})