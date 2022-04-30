import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import contexts from "../../../Components/APIContext";
import { selectedTradeBlocksContext } from "../../../Components/LabSwap/LabSwap";
import { LabSwapBlock } from "../../../Components/LabSwap/LabSwapBlock";
import { CourseBlock, Person } from '../../../modules/API'
import { CompressedCourseBlock } from '../../../modules/BlockFunctions'

jest.mock("../../../Components/APIContext");

describe("LabSwapBlock", () => {
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
        capacity_peer_teachers: 3
    };

    const data: CompressedCourseBlock = {
        ...course_instance,
        section_numbers: ["501", "502", "503"],
        professors: ["TBA", "Bobby", "Thomas"],
        section_ids: [0, 1, 2],
        locations: ["ZACH", "ZACH", "EABA"],
        scheduledAll: [
            [55, 56, 57],
            [0],
            [59,60]
        ]
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
        desired_number_assignments: 0
    };

    describe("Content", () => {
        it("contains correct text when clicked", () => {
            render(<LabSwapBlock visible={true} data={{ course_instance: data, linkIDs: null }}/>)
            screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`).click();
            expect(screen.getByText("Select course to request")).toBeInTheDocument();
            expect(screen.getByText("Request selected section")).toBeInTheDocument();

            for (let i = 0; i < data.section_ids.length; i++) {
                expect(screen.getByText(`${data.course_number}-${data.section_numbers[i]} with ${data.professors[i]}`)).toBeInTheDocument();
            }
        });

        it("contains correct text when not clicked", () => {
            render(<LabSwapBlock visible={true} data= {{ course_instance: data, linkIDs: null }}/>)
   
            expect(screen.getByText(`${course_instance.course_number}`)).toBeInTheDocument();
            expect(screen.queryByText("Select course to request")).not.toBeInTheDocument();
            expect(screen.queryByText("Request selected section")).not.toBeInTheDocument();

            for (let i = 0; i < data.section_ids.length; i++) {
                expect(screen.queryByText(`${data.course_number}-${data.section_numbers[i]} with ${data.professors[i]}`)).not.toBeInTheDocument();
            }
        })
    });
    
    describe("functionality", () => {
        it("is clickable", () => {
            render(<LabSwapBlock visible={true} data={{ course_instance: data, linkIDs: null }}/>)
            screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`).click();
            expect(screen.getByText("Select course to request")).toBeInTheDocument();
        });

        it('demphesizes when clicked outside', () => {
            render(<LabSwapBlock visible={true} data={{ course_instance: data, linkIDs: null }}/>)
            screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`).click();
            expect(screen.getByText("Select course to request")).toBeInTheDocument();

            userEvent.click(document.body);
            expect(screen.queryByText("Select course to request")).not.toBeInTheDocument();
        })

        it("can request a section", () => {
            const setSelectedTradeBlocks = jest.fn();
            render(
                < selectedTradeBlocksContext.Provider value={[{offered: null, requested: null}, setSelectedTradeBlocks]}>
                    < contexts.user.Provider value={{ user: person, doShowProfile: true, doShowAdmin: true, doShowLabSwap: true, doShowScheduling: true }}>
                        <LabSwapBlock visible={true} data={{ course_instance: data, linkIDs: null }}/>
                    </ contexts.user.Provider >
                </selectedTradeBlocksContext.Provider>
            );

            screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`).click();
            screen.getByText(/with Thomas/).click();
            screen.getByRole('button', { name: /Request selected section/i }).click();

            const idx = data.professors.findIndex(prof => prof === "Thomas");
            expect(setSelectedTradeBlocks).toHaveBeenCalledWith({offered: null, requested: {
                ...data,
                section_id: data.section_ids[idx],
                section_number: data.section_numbers[idx],
                professor: data.professors[idx],
                scheduled: data.scheduledAll[idx]
            }});
        });

        it("can offer a section", () => {
            const setSelectedTradeBlocks = jest.fn();
            render(
                < selectedTradeBlocksContext.Provider value={[{offered: null, requested: null}, setSelectedTradeBlocks]}>
                    < contexts.user.Provider value={{ user: person, doShowProfile: true, doShowAdmin: true, doShowLabSwap: true, doShowScheduling: true }}>
                        <LabSwapBlock visible={true} data={{ course_instance: data, linkIDs: null }}/>
                    </ contexts.user.Provider >
                </selectedTradeBlocksContext.Provider>
            );

            screen.getByTitle(`${course_instance.course_number}-${course_instance.section_number}`).click();
            screen.getByText(/with Bobby/).click();
            screen.getByRole('button', { name: /Offer selected section/i }).click();

            const idx = data.professors.findIndex(prof => prof === "Bobby");
            expect(setSelectedTradeBlocks).toHaveBeenCalledWith({requested: null, offered: {
                ...data,
                section_id: data.section_ids[idx],
                section_number: data.section_numbers[idx],
                professor: data.professors[idx],
                scheduled: data.scheduledAll[idx]
            }});
        })
    })

})