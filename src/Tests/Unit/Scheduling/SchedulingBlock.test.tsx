import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';

export interface APICourseBlock {
	department: string
	course_number: number
	section_number: number
	start_time: Date
	end_time: Date
	weekday: string
	place: string
}

describe('SchedulingBlock', () => {
    const renderSubject = () => render(< SchedulingBlock visible={true} course_instance={
        {
            department: "CSCE",
            course_number: 121,
            section_number: 100,
            section_id: 1,
            start_time: new Date(0),
            end_time: new Date(1000*60*50), // 50 minutes long
            weekday: "none listed",
            place: "nowhere",
            scheduled: null
        }
    } linkIDs={[]}/>);

    it('displays the course', () => {
        renderSubject();
        
        const element = screen.getByText(/121/);
        expect(element).toBeInTheDocument();
    });

    it('displays the section', () => {
        renderSubject();
        
        const element = screen.getByText(/101/);
        expect(element).toBeInTheDocument();
    });
});