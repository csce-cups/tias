import { render, screen, fireEvent } from "@testing-library/react";
import { DisplayBlock } from "../../../Components/LabSwap/DisplayBlock";
import { CourseBlock, Person } from '../../../modules/API'

describe("DisplayBlock", ()=>{
    const course_instance:CourseBlock = {
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
        it("Null Course Instance",()=>{
            render(<DisplayBlock visible={true} data={{ course_instance: null, person: null, shift: false }}/>)
            expect(screen.getByText("None selected")).toBeInTheDocument()
        });

        it("Contains correct text", ()=>{
            render(<DisplayBlock visible={true} data= {{ course_instance: course_instance, person: person, shift: true }}/>)
            //need to trigger the mouse click
            fireEvent.click(screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`))
            expect(screen.getByText(`Trade with: ${person.first_name} ${person.last_name}`)).toBeInTheDocument();
            expect(screen.getByText(`${course_instance.department}: ${course_instance.course_number}-${course_instance.section_number}`)).toBeInTheDocument();

            expect(screen.getByText(`Professor ${course_instance.professor}`)).toBeInTheDocument();

            expect(screen.getByText(`Trade with: ${person.first_name} ${person.last_name}`)).toBeInTheDocument();

            expect(screen.getByText(`Trade with: ${person.first_name} ${person.last_name}`)).toBeInTheDocument();

        })
    })


})