import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';
import { CourseBlock } from '../../../modules/API';
import { OptionsProps } from '../../../Components/Scheduling/SchedulingWindow';
import { APIContext } from '../../../Components/APIContext';

jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/Misc/Hat');

describe('SchedulingBlock', () => {
    let renderData: CourseBlock;
    let options: OptionsProps;

    beforeEach(() => {
        renderData = {
            department: "CSCE",
            course_number: 121,
            section_number: '100',
            section_id: 1,
            start_time: new Date((8+6)*60*60*1000),
            end_time: new Date((8+6)*60*60*1000 + 50*60*1000), // 50 minutes long
            weekday: "none listed",
            place: "nowhere",
            scheduled: null,
            professor: "",
            capacity_peer_teachers: 2,
        }
        options = {
            editing: {
                bool: [false, () => {}],
                count: [0, () => {}],
            }
        }
    })

    const renderSubject = (classes: string, hats?: number) => render(
        < APIContext >
            <div className={classes}>
                < SchedulingBlock visible={true} data={{
                    course_instance: renderData,
                    linkIDs: hats? Array.from(Array(hats).keys()) : []
                }} options={options}/>
            </div>
        </APIContext>
    );

    describe('standard view', () => {
        it('displays the course', () => {
            renderSubject("");
            
            const elements = screen.getAllByText(/121/);
            expect(elements.length).toBeGreaterThan(0);
        });
    
        it('displays the section', () => {
            renderSubject("");
            
            const elements = screen.getAllByText(/100/);
            expect(elements.length).toBeGreaterThan(0);
        });

        describe('hats', () => {
            it('does not make hats without link IDs', () => {
                renderSubject("");
    
                const elements = screen.queryAllByTestId("hat");
                expect(elements.length).toBe(0);
            });
    
            it('alerts when unscheduled', () => {
                renderSubject("");
    
                const elements = screen.getAllByTestId("alert hat");
                expect(elements.length).toBeGreaterThan(0);
            });
    
            it('does not alert when unscheduled but the capacity is 0', () => {
                renderData.capacity_peer_teachers = 0;
                renderSubject("");

                const elements = screen.queryAllByTestId("alert hat");
                expect(elements.length).toBe(0);
            });
    
            it('makes hats with link IDs', () => {
                renderSubject("", 3);
    
                const elements = screen.queryAllByTestId("hat");
                expect(elements.length).toBe(3);
            });
        });
    });

    describe('detail view', () => {
        it('shows the department', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(/CSCE/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the course number', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(/121/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the section number', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(/100/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the start time', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(/8:00 AM/i);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the end time', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(/8:50 AM/i);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the location', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(/nowhere/i);
            expect(elements.length).toBeGreaterThan(0);
        })
    })

    describe('editing', () => {
        it('enters edit detail when clicked', () => {
            options.editing!.bool[0] = true;
            renderSubject("editing");

            const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
            subject.click();
            expect(subject).toHaveClass("interacted");
        });

        describe('displays', () => {
            beforeEach(() => {
                options.editing!.bool[0] = true;
            })

            it('the department', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/CSCE/);
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the course number', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/121/);
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the section number', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/100/);
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the start time', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/8:00 AM/i);
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the end time', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/8:50 AM/i);
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the location', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/nowhere/i);
                expect(elements.length).toBeGreaterThan(0);
            })

            it('the desired number of peer teachers', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(/Desired PT Count: 2/i);
                expect(elements.length).toBeGreaterThan(0);
            })
        })

        describe("function", () => {
            describe("dropdown", () => {
                it('the dropdown contains valid peer teachers for the section', () => {
                    const r = renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();
                    r.debug();

                    const elements = screen.getAllByText(/Peer Teacher 1/i);
                    expect(elements.length).toBeGreaterThan(0);
                });

                it.todo('the dropdown does not contain invalid peer teachers for the section');
                it.todo('in the dropdown, peer teachers who prefer the section are labeled as such');
                it.todo('in the dropdown, peer teachers who are indifferent about the section are labeled as such');
                it.todo('in the dropdown, peer teachers who do not prefer the section are labeled as such');
                it.todo("in the dropdown, peer teachers who can't do the section don't show up");
                it.todo("in the dropdown, peer teachers with a time conflic are labeled as such");
            });

            describe("buttons", () => {
                describe("view", () => {
                    it.todo('selecting a peer teacher enables the button');
                    it.todo('selecting a peer teacher with a time conflict disables the button');
                    it.todo('making an edit enables the reset button');

                    it.todo("selecting a peer teacher that isn't scheduled for the section makes the button say they can be added");
                    it.todo("selecting a peer teacher that is scheduled for the section makes the button say they can be removed");
                });

                describe("functionality", () => {
                    it.todo("selecting a peer teacher that isn't scheduled for the section and clicking the button adds the peer teacher to the section");
                    it.todo("selecting a peer teacher that is scheduled for the section and clicking the button removes the peer teacher from the section");
                    it.todo("clicking the reset button after an edit restores the section to before the edit");

                    describe("section link", () => {
                        it.todo("edits on one block are reflected on other blocks of the same section (Adding)");
                        it.todo("edits on one block are reflected on other blocks of the same section (Removing)");
                        it.todo("edits on one block are reflected on other blocks of the same section (Resetting)");
                        it.todo("adding a peer teacher to a section marks them unavailable to other sections at the same time");
                        it.todo("removing a peer teacher from a section marks them available to other sections at the same time");
                        it.todo("reseting a section updates peer teacher availabilities for other sections");
                    })
                })
            })
        })
    })
});