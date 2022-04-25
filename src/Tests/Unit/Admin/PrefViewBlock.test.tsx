import {screen, render} from '@testing-library/react';
import { PrefViewBlock } from '../../../Components/Admin/PrefViewBlock';
import { CompressedCourseBlock } from '../../../modules/BlockFunctions';

describe("PrefViewBlock", () => {
  const ci = {
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
    capacity_peer_teachers: 1,
    section_numbers: ["501", "502", "503"],
    professors: ["Abby", "Babby", "Crabby"],
    section_ids: [1, 2, 3],
    locations: ["BUILDING A", "BUILDING B", "BUILDING C"],
    scheduledAll: [[1, 2], [], [3]],
  } as CompressedCourseBlock;
  const renderData = {
    course_instance: ci,
    linkIDs: []
  }

  it("shows the course number", () => {
    render(<PrefViewBlock data={renderData} visible={true}/>);
    expect(screen.getByText(ci.course_number.toString())).toBeInTheDocument();
  })
})