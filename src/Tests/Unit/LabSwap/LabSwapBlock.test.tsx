import { render, screen, fireEvent } from "@testing-library/react";
import { LabSwapBlock } from "../../../Components/LabSwap/LabSwapBlock";
import { CourseBlock, Person } from '../../../modules/API'
import { CompressedCourseBlock } from '../../../modules/BlockFunctions'

describe("LabSwapBlock", ()=>{
    const course_instance:CourseBlock = {
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
        capacity_peer_teachers: 3
    };
    const data:CompressedCourseBlock = {
        ...course_instance,
        section_numbers: ["501", "502", "503"],
        professors: ["Leyk", "Leyk", "Thomas"],
        section_ids: [0, 1, 2],
        locations: ["ZACH", "ZACH", "EABA"],
        scheduledAll: [[55, 56, 57],[58],[59,60]]
    }
    const person:Person = {
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
    describe("Content", ()=>{


        it("Contains correct text when clicked", ()=>{
            render(<LabSwapBlock visible={true} data= {{ course_instance: data, linkIDs: null }}/>)
            fireEvent.click(screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`))
            expect(screen.getByText("Select course to request")).toBeInTheDocument();
            expect(screen.getByText("Request selected section")).toBeInTheDocument();

            for(let i = 0; i < data.section_ids.length; i++){
                expect(screen.getByText(`${data.course_number}-${data.section_numbers[i]} with ${data.professors[i]}`)).toBeInTheDocument();
            }
        })
        it("Contains correct text when not clicked", ()=>{
            render(<LabSwapBlock visible={true} data= {{ course_instance: data, linkIDs: null }}/>)
   
            expect(screen.getByText(`${course_instance.course_number}`)).toBeInTheDocument();
            expect(screen.queryByText("Select course to request")).not.toBeInTheDocument();
            expect(screen.queryByText("Request selected section")).not.toBeInTheDocument();

            for(let i = 0; i < data.section_ids.length; i++){
                expect(screen.queryByText(`${data.course_number}-${data.section_numbers[i]} with ${data.professors[i]}`)).not.toBeInTheDocument();
            }
        })
    })


})