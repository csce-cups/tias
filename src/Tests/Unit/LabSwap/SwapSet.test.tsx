import { render, screen } from "@testing-library/react";
import { SwapSet } from "../../../Components/LabSwap/SwapSet";
import { CourseBlock, Person } from '../../../modules/API'

jest.mock("../../../Components/LabSwap/DisplayBlock")
interface TradeInfo {
    block: CourseBlock | null
    person: Person | null | undefined
  }
describe("SwapSet", ()=>{
    const Cblock1:CourseBlock = {
        department: "CSCE1",
        course_number: 101,
        section_number: "500",
        section_id: 0,
        start_time: new Date(Math.random()),
        end_time: new Date(Math.random()+7),
        weekday: "W",
        place: "ZACH 420",
        scheduled: [1, 2, 3],
        professor: "Leyk"
    };
    const person1:Person = {
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
        desired_number_assignments: 0
    };
    const Cblock2:CourseBlock = {
        department: "CSCE2",
        course_number: 102,
        section_number: "501",
        section_id: 1,
        start_time: new Date(Math.random()+10),
        end_time: new Date(Math.random()+17),
        weekday: "T",
        place: "ZACH 820",
        scheduled: [4, 5, 6],
        professor: "Thomas"
    };
    const person2:Person = {
        person_id: 1,
        email: "test2",
        first_name: "C",
        last_name: "D",
        profile_photo_url: "400",
        peer_teacher: false,
        teaching_assistant: false,
        administrator: false,
        professor: false,
        isScheduled: false,
        isChecked: false,
        desired_number_assignments: 0
    };
    const trade1:TradeInfo = {
        block: Cblock1,
        person: person1
    }
    const trade2:TradeInfo = {
        block: Cblock2,
        person: person2
    }
    describe("Content", ()=>{
        it("Contains correct courses", ()=>{
            render(<SwapSet selected={[trade1, trade2]}/>)

            expect(screen.getByTestId(JSON.stringify(Cblock1))).toBeInTheDocument();
            expect(screen.getByTestId(JSON.stringify(Cblock2))).toBeInTheDocument();
        })
    })




})