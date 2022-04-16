import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';

jest.mock('../../../Components/Misc/Hat');

describe('SchedulingBlock', () => {
    const renderSubject = (hats?: number) => render(< SchedulingBlock visible={true} data={{
        course_instance: {
            department: "CSCE",
            course_number: 121,
            section_number: '100',
            section_id: 1,
            start_time: new Date(0),
            end_time: new Date(1000*60*50), // 50 minutes long
            weekday: "none listed",
            place: "nowhere",
            scheduled: null,
            professor: ""
        },
        linkIDs: hats? Array.from(Array(hats).keys()) : []
    }} />);

    const renderDetailedSubject = (hats?: number) => render(
        <div className="detailed">
            < SchedulingBlock visible={true} data={{
                course_instance: {
                    department: "CSCE",
                    course_number: 121,
                    section_number: '100',
                    section_id: 1,
                    start_time: new Date((6+8)*60*60*1000), // Start at 8
                    end_time: new Date((6+8)*60*60*1000 + 1000*60*50), // 50 minutes long
                    weekday: "none listed",
                    place: "nowhere",
                    scheduled: null,
                    professor: ""
                },
                linkIDs: hats? Array.from(Array(hats).keys()) : []
            }} />
        </div>
    );

    describe('standard view', () => {
        it('displays the course', () => {
            renderSubject();
            
            const elements = screen.getAllByText(/121/);
            expect(elements.length).toBeGreaterThan(0);
        });
    
        it('displays the section', () => {
            renderSubject();
            
            const elements = screen.getAllByText(/100/);
            expect(elements.length).toBeGreaterThan(0);
        });

        describe('hats', () => {
            it('does not make hats without link IDs', () => {
                renderSubject();
    
                const elements = screen.queryAllByTestId("hat");
                expect(elements.length).toBe(0);
            });
    
            it('alerts when unscheduled', () => {
                renderSubject();
    
                const elements = screen.getAllByTestId("alert hat");
                expect(elements.length).toBeGreaterThan(0);
            });
    
            it.todo('does not alert when unscheduled but the capacity is 0');
    
            it('makes hats with link IDs', () => {
                renderSubject(3);
    
                const elements = screen.queryAllByTestId("hat");
                expect(elements.length).toBe(3);
            });
        });
    });

    describe('detail view', () => {
        it('shows the department', () => {
            renderDetailedSubject();

            const elements = screen.getAllByText(/CSCE/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the course number', () => {
            renderDetailedSubject();

            const elements = screen.getAllByText(/121/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the section number', () => {
            renderDetailedSubject();

            const elements = screen.getAllByText(/100/);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the start time', () => {
            renderDetailedSubject();

            const elements = screen.getAllByText(/8:00 AM/i);
            expect(elements.length).toBeGreaterThan(0);
        });

        it('shows the end time', () => {
            renderDetailedSubject();

            const elements = screen.getAllByText(/8:50 AM/i);
            expect(elements.length).toBeGreaterThan(0);
        });
    })
});