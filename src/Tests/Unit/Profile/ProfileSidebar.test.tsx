import { screen, render } from '@testing-library/react';
import contexts, { APIContext } from '../../../Components/APIContext';
import { ProfileSidebar } from '../../../Components/Profile/ProfileSidebar';
import { CourseBlockWeek, CourseBlockWeekKey, Person } from '../../../modules/API';
import { APINoAsync } from '../../../modules/__mocks__/API';
import { ContextSetterSpy } from '../../helpers/ContextSetterSpy';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileSidebar', () => {
  const person: Person = {
    ...APINoAsync.fetchPTList()[0],
    peer_teacher: true,
    teaching_assistant: true,
    professor: true,
    administrator: true
  };

  const week = APINoAsync.fetchCourseBlocks();
  const data: CourseBlockWeek = {
    Monday: week.Monday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Tuesday: week.Tuesday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Wednesday: week.Wednesday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Thursday: week.Thursday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3),
    Friday: week.Friday!.map((b, i) => ({...b, scheduled: [i%3? person.person_id : -1]})).sort((a, b) => a.section_id % 3 - 1 + b.section_id % 3)
  };

  const schedule = new Map((
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as CourseBlockWeekKey[])
      .map(day => data[day]?.map(b => [b.section_id.toString(), b.scheduled]) as [string, number[]][] || [])
      .flat()
  );

  it('displays when scheduling hasn\'t happened', () => {
    render(<ProfileSidebar />);
    expect(screen.getByText("Scheduling hasn't happened.")).toBeInTheDocument();
  });
  
  it('displays when unscheduled', () => {
    render(
      <APIContext>
        <ProfileSidebar />
      </APIContext>
    );
    expect(screen.getByText("No assigned labs")).toBeInTheDocument();
  });
  
  it('displays scheduled blocks', () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `tias_user_id=${person.person_id}`,
    });
    render(
      <APIContext>
        < ContextSetterSpy what={contexts.blocks} value={data} >
          < ContextSetterSpy what={contexts.loadedSchedule} value={schedule} >
            < contexts.user.Provider value={{user: person, doShowAdmin: true, doShowLabSwap: true, doShowProfile: true, doShowScheduling: true}} >
              <ProfileSidebar />
            </contexts.user.Provider>
          </ContextSetterSpy>
        </ContextSetterSpy>
      </APIContext>
    );

    (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as CourseBlockWeekKey[]).forEach((day: CourseBlockWeekKey) => {
      data[day]?.forEach(block => {
        if (block.scheduled?.includes(person.person_id)) {
          expect(screen.getByText(`${block.department}: ${block.course_number}-${block.section_number}`)).toBeInTheDocument();
        }
      });
    });
  })
}); 