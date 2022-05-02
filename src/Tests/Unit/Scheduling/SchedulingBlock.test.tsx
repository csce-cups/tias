import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';
import { CourseBlock } from '../../../modules/API';
import { OptionsProps } from '../../../Components/Scheduling/SchedulingWindow';
import contexts, { APIContext } from '../../../Components/APIContext';
import { PersonPrefLink, reverseViableCourses } from '../../../Components/APIContextHelper';
import { APINoAsync } from '../../../modules/__mocks__/API';
import userEvent from '@testing-library/user-event';

jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/Misc/Hat');

describe('SchedulingBlock', () => {
    let renderData = APINoAsync.fetchCourseBlocks().Monday![0];
    const employees = APINoAsync.fetchPTList();
    let cmap = reverseViableCourses(APINoAsync.fetchAllViableCourses());
    let options: OptionsProps;

    beforeEach(() => {
        options = {
            editing: {
                bool: [false, () => {}],
                count: [0, () => {}],
            }
        }
    })

    const renderSubject = (classes: string, hats?: number[]) => render(
        < APIContext >
            < contexts.allViableCourses.Consumer >
                {([,,allViableCoursesMap]) => {
                    cmap = allViableCoursesMap;
                    return (
                        <div className={classes}>
                            < SchedulingBlock visible={true} data={{
                                course_instance: renderData,
                                linkIDs: (hats === undefined)? [] : hats
                            }} options={options}/>
                        </div>
                    )
                }}
            </contexts.allViableCourses.Consumer>
        </APIContext>
    );

    describe('standard view', () => {
        it('displays the course', () => {
            renderSubject("");
            
            const elements = screen.getAllByText(new RegExp(renderData.course_number.toString()));
            expect(elements.length).toBeGreaterThan(0);
        });
    
        it('displays the section', () => {
            renderSubject("");
            
            const elements = screen.getAllByText(new RegExp(renderData.section_number.toString()));
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
                renderSubject("", [1, 2, 3]);
    
                const elements = screen.queryAllByTestId("hat");
                expect(elements.length).toBe(3);
            });
        });
    });

    describe('detail view', () => {
        it('shows the department', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(new RegExp(renderData.department.toString()));
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the course number', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(new RegExp(renderData.course_number.toString()));
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the section number', () => {
            renderSubject("detailed");

            const elements = screen.getAllByText(new RegExp(renderData.section_number.toString()));
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

            const elements = screen.getAllByText(/BUILDING .*/i);
            expect(elements.length).toBeGreaterThan(0);
        })
    })

    describe('editing', () => {
        beforeEach(() => {
            options.editing!.bool[0] = true;
            renderData.forbidden = [];
            renderData.scheduled = [];
        })

        it('enters edit detail when clicked', () => {
            options.editing!.bool[0] = true;
            renderSubject("editing");

            const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
            subject.click();
            expect(subject).toHaveClass("interacted");
        });

        it('exits edit detail when clicked outside of the block', () => {
            options.editing!.bool[0] = true;
            renderSubject("editing");

            const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
            subject.click();
            expect(subject).toHaveClass("interacted");

            userEvent.click(document.body);
            expect(subject).not.toHaveClass("interacted");
        })

        describe('displays', () => {
            it('the department', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(new RegExp(renderData.department.toString()));
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the course number', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(new RegExp(renderData.course_number.toString()));
                expect(elements.length).toBeGreaterThan(0);
            });

            it('the section number', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(new RegExp(renderData.section_number.toString()));
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

                const elements = screen.getAllByText(/BUILDING .*/i);
                expect(elements.length).toBeGreaterThan(0);
            })

            it('the desired number of peer teachers', () => {
                renderSubject("editing");
                const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                subject.click();

                const elements = screen.getAllByText(new RegExp("Desired PT Count: " + renderData.capacity_peer_teachers.toString()));
                expect(elements.length).toBeGreaterThan(0);
            })
        })

        describe("function", () => {
            describe("dropdown", () => {
                it('the dropdown contains valid peer teachers for the section', () => {
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    cmap.get(renderData.section_id)!.filter(link => link.pref !== "Can't Do").forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        const matcher = new RegExp(`${fella.first_name} ${fella.last_name}( |$)`);
                        expect(screen.getByText(matcher)).toBeInTheDocument();
                    });
                });

                it('the dropdown does not contain invalid peer teachers for the section', () => {
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    const validPtids = cmap.get(renderData.section_id)!.map(link => link.person_id);
                    const invalidPts = employees.filter(e => !validPtids.includes(e.person_id));
                    
                    invalidPts.forEach(pt => {
                        const matcher = new RegExp(`${pt.first_name} ${pt.last_name}( |$)`);
                        expect(screen.queryByText(matcher)).not.toBeInTheDocument();
                    });
                });

                it('in the dropdown, peer teachers who prefer the section are labeled as such', () => {
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    cmap.get(renderData.section_id)!.filter(link => link.pref === "Prefer To Do").forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        expect(screen.getByText(`${fella.first_name} ${fella.last_name} (Want)`)).toBeInTheDocument();
                    });
                });

                it('in the dropdown, peer teachers who are indifferent about the section are labeled as such', () => {
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    cmap.get(renderData.section_id)!.filter(link => link.pref === "Indifferent").forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        const matcher = new RegExp(`${fella.first_name} ${fella.last_name}$`);
                        expect(screen.getByText(matcher)).toBeInTheDocument();
                    });
                });

                it('in the dropdown, peer teachers who do not prefer the section are labeled as such', () => {
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    cmap.get(renderData.section_id)!.filter(link => link.pref === "Prefer Not To Do").forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        expect(screen.getByText(`${fella.first_name} ${fella.last_name} (Don't Want)`)).toBeInTheDocument();
                    });
                });

                it("in the dropdown, peer teachers who can't do the section don't show up", () => {
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    cmap.get(renderData.section_id)!.filter(link => link.pref === "Can't Do").forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        expect(screen.queryByText(`${fella.first_name} ${fella.last_name}`)).not.toBeInTheDocument();
                    });
                });

                it("in the dropdown, peer teachers with a time conflict are labeled as such", () => {
                    const dropdownPeople = cmap.get(renderData.section_id)?.filter(l => l.pref !== "Can't Do")!
                    renderData.forbidden = [
                        dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id,
                        dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id,
                        dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id
                    ];
                    
                    renderSubject("editing");
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    dropdownPeople.filter(link => renderData.forbidden?.includes(link.person_id)).forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        expect(screen.getByText(`${fella.first_name} ${fella.last_name} (TIME CONFLICT)`)).toBeInTheDocument();
                    });
                });

                it("in the dropdown, peer teachers scheduled for the section are labeled as such", () => {
                    const dropdownPeople = cmap.get(renderData.section_id)!

                    renderSubject("editing", [
                        dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id,
                        dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id,
                        dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id
                    ]);
                    const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                    subject.click();

                    dropdownPeople.filter(link => renderData.scheduled?.includes(link.person_id)).forEach(link => {
                        const fella = employees.find(e => e.person_id === link.person_id)!;
                        const matcher = new RegExp(`> ${fella.first_name} ${fella.last_name} .*`);
                        expect(screen.getByText(matcher)).toBeInTheDocument();
                    });
                });
            });

            describe("buttons", () => {
                let dropdownPeople = cmap.get(renderData.section_id)!.filter(l => l.pref !== "Can't Do")!
                let target = employees.find(e => e.person_id === dropdownPeople[0].person_id)!;
                let target2 = employees.find(e => e.person_id === dropdownPeople[1].person_id)!;

                beforeEach(() => {
                    dropdownPeople = cmap.get(renderData.section_id)!.filter(l => l.pref !== "Can't Do")!
                    target = employees.find(e => e.person_id === dropdownPeople[0].person_id)!;
                    target2 = employees.find(e => e.person_id === dropdownPeople[1].person_id)!;
                });

                describe("view", () => {
                    it('the reset and submit buttons are disabled by default', () => {
                        renderSubject("editing");
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();
                        screen.getAllByRole('button').forEach(button => {
                            expect(button).not.toBeEnabled();
                        })
                    })

                    it('selecting a peer teacher enables the button', () => {
                        renderSubject("editing");
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        expect(submitButton).toBeEnabled();
                    });

                    it("selecting a peer teacher that isn't scheduled for the section makes the button say they can be added", () => {
                        renderSubject("editing");
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        expect(submitButton).toHaveTextContent(`Add to ${renderData.department} ${renderData.course_number}-${renderData.section_number}`);
                    });

                    it("selecting a peer teacher that is scheduled for the section makes the button say they can be removed", () => {
                        renderSubject("editing", [target.person_id]);
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        expect(submitButton).toHaveTextContent(`Remove from ${renderData.department} ${renderData.course_number}-${renderData.section_number}`);
                    });

                    it('selecting a peer teacher with a time conflict disables the button', () => {
                        const dropdownPeople = cmap.get(renderData.section_id)?.filter(l => l.pref !== "Can't Do")!
                        renderData.forbidden = [
                            dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id,
                            dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id,
                            dropdownPeople[Math.floor(Math.random() * dropdownPeople.length)].person_id
                        ];
                    
                        renderSubject("editing");
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const target = employees.find(e => e.person_id === renderData.forbidden![0])!;
                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        expect(submitButton).not.toBeEnabled();
                        expect(submitButton).toHaveTextContent(/TIME CONFLICT.*/);

                    });
                    
                    it('making an edit enables the reset button (requires manual add user to pass)', () => {
                        renderSubject("editing");
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        expect(submitButton).toHaveTextContent(`Add to ${renderData.department} ${renderData.course_number}-${renderData.section_number}`);
                        submitButton.click();
                        
                        const resetButton = screen.getAllByRole('button').filter(b => b.textContent === "Reset")[0];
                        expect(resetButton).toBeEnabled();
                    });
                });

                describe("functionality", () => {
                    it("selecting a peer teacher that isn't scheduled for the section and clicking the button adds the peer teacher to the section", () => {
                        renderSubject("editing");
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        submitButton.click();
                        
                        const hats = screen.getAllByTestId("hat");
                        expect(hats.find(h => +h.getAttribute('link-id')! === target.person_id)).toBeTruthy();
                    });

                    it("selecting a peer teacher that is scheduled for the section and clicking the button removes the peer teacher from the section", () => {
                        renderSubject("editing", [target.person_id, target2.person_id]);
                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        fireEvent.change(select, {
                            target: { value: target.person_id }
                        });

                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        submitButton.click();
                        
                        const hats = screen.getAllByTestId("hat");
                        expect(hats.find(h => +h.getAttribute('link-id')! === target.person_id)).toBeFalsy();
                    });

                    it("clicking the reset button after an edit restores the section to before the edit (depends on add and remove functionality)", () => {
                        renderData.ronly_scheduled = [target.person_id, target2.person_id];
                        renderSubject("editing", [target.person_id, target2.person_id]);
                        const expectedHats = screen.getAllByTestId("hat");

                        const subject = screen.getByTitle(`${renderData.course_number}-${renderData.section_number}`);
                        subject.click();

                        const select = screen.getByRole('combobox');
                        const submitButton = screen.getAllByRole('button').filter(b => b.textContent !== "Reset")[0];
                        [
                            target,
                            employees.find(e => e.person_id === dropdownPeople[1].person_id)!,
                            employees.find(e => e.person_id === dropdownPeople[2].person_id)!,
                            employees.find(e => e.person_id === dropdownPeople[3].person_id)!
                        ].forEach(e => {
                            fireEvent.change(select, {
                                target: { value: e.person_id }
                            });
                            submitButton.click();
                        });
                        expect(screen.getAllByTestId("hat")).not.toEqual(expectedHats);
                        
                        const reset = screen.getAllByRole('button').filter(b => b.textContent === "Reset")[0];
                        reset.click();
                        
                        expect(screen.getAllByTestId("hat")).toEqual(expectedHats);
                    });

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