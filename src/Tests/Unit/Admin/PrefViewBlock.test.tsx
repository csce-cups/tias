import {screen, render} from '@testing-library/react';
import { PrefViewBlock } from '../../../Components/Admin/PrefViewBlock';
import { APIContext } from '../../../Components/APIContext';
import { CompressedCourseBlock } from '../../../modules/BlockFunctions';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../Components/APIContext');

describe("PrefViewBlock", () => {
  const block = APINoAsync.fetchCourseBlocks().Monday![0];
  const ci = {
    ...block,
    section_numbers: ["501", "502", "503"],
    professors: ["Abby", "Babby", "Crabby"],
    section_ids: [1, 2, 3],
    locations: ["BUILDING A", "BUILDING B", "BUILDING C"],
    scheduledAll: [[1, 2], [], [3]],
  } as CompressedCourseBlock;

  const renderSubject = () => render(
    <APIContext>
      <PrefViewBlock data={{
        course_instance: ci,
        linkIDs: []
      }} visible={true}/>
    </APIContext>
  );

  it("shows the course number", () => {
    renderSubject();
    expect(screen.getByText(ci.course_number.toString())).toBeInTheDocument();
  });
  
  it("becomes detailed when clicked", () => {
    renderSubject();
    screen.getByText(ci.course_number.toString()).click();

    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });
})