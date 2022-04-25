import { LabSwap } from "../../../Components/LabSwap/LabSwap";
import { render, screen, waitFor } from '@testing-library/react';
import { contexts } from '../../../Components/APIContextHelper'

import API, {APINoAsync} from '../../../modules/__mocks__/API'
import { wait } from "@testing-library/user-event/dist/utils";
import {APIContext} from "../../../Components/APIContext";
import { CompressedCourseBlock } from "../../../modules/BlockFunctions";
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/LabSwap/DisplayBlock');
jest.mock('../../../Components/Scheduling/SchedulingWindow');


//TEST DATA USED IN SCHEDULING WINDOW MOCK
const offer1:CompressedCourseBlock = {
    section_numbers: ["500"],
    professors: ["Leyk"],
    section_ids: [0],
    locations: ["Zach"],
    scheduledAll: [[1]],
    department: 'CSCE',
    course_number: 102,
    section_number: '500',
    section_id: 0,
    start_time:null,
    end_time: null,
    weekday: 'W',
    place: 'Zach',
    scheduled: [1],
    professor: 'Leyk',
    capacity_peer_teachers: 1
  }
  const request1:CompressedCourseBlock = {
    section_numbers: ["600"],
    professors: ["Thomas"],
    section_ids: [10],
    locations: ["EABA"],
    scheduledAll: [[11]],
    department: 'CSCE',
    course_number: 221,
    section_number: '600',
    section_id: 10,
    start_time: null,
    end_time: null,
    weekday: 'W',
    place: 'EABA',
    scheduled: [11],
    professor: 'Thomas',
    capacity_peer_teachers: 1
  }
  const request = {
    ...request1,
    section_number: request1.section_numbers[0],
        professor: request1.professors[0],
        section_id: request1.section_ids[0],
        scheduled: request1.scheduledAll[0]
  }
  const offer = {
    ...offer1,
    section_number: offer1.section_numbers[0],
        professor: offer1.professors[0],
        section_id: offer1.section_ids[0],
        scheduled: offer1.scheduledAll[0]
  }
describe("LabSwap",()=>{
    it("Find Buttons", async () => {
        const view = render(
            <APIContext>
            <LabSwap/>
          </APIContext>
        )
        
        
        const reqButton = screen.getByTestId("request");
        const offButton = screen.getByTestId("offer")
        expect(reqButton).toBeInTheDocument();
        expect(offButton).toBeInTheDocument();
        
    })
      it("Click Buttons", async () => {
          const view = render(
              <APIContext>
            <LabSwap/>
          </APIContext>
        )
        
        
        const reqButton = screen.getByTestId("request");
        const offButton = screen.getByTestId("offer")
        
        reqButton.click();
        expect(screen.getByTestId(JSON.stringify(request1))).toBeInTheDocument();
        offButton.click();
        expect(screen.getByTestId(JSON.stringify(offer1))).toBeInTheDocument();
        
    })
    it("Select Trades", async () => {
        const view = render(
          <APIContext>
            <LabSwap/>
          </APIContext>
        )
        const retVal = {
            msg: false,
            err: false
        }
        const submitTrade = jest.spyOn(API, "submitTrade").mockImplementation(()=> new Promise(res => res(retVal)));
    
        const reqButton = screen.getByTestId("request");
        const offButton = screen.getByTestId("offer")
        expect(reqButton).toBeInTheDocument();
        expect(offButton).toBeInTheDocument();
        reqButton.click();
        expect(screen.getByTestId(JSON.stringify(request1))).toBeInTheDocument();
        offButton.click();
        expect(screen.getByTestId(JSON.stringify(offer1))).toBeInTheDocument();
        const submitButton = screen.getByText("Request Trade");
        submitButton.click();
        await waitFor(()=>{
    
            expect(screen.getByText("Updating")).toBeInTheDocument()
        })
      })
})