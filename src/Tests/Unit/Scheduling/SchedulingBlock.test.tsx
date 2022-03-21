import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';


describe('SchedulingBlock', () => {
    beforeEach(() => render(< SchedulingBlock visible={true} course_instance={
        {
            course: 121, 
            section: 101, 
            start:  new Date(0), 
            end: new Date(1000*60*50) // 50 minutes long
        }
    } linkIDs={[]}/>));

    it('displays the course', () => {
        const element = screen.getByText(/121/);
        expect(element).toBeInTheDocument();
    });

    it('displays the section', () => {
        const element = screen.getByText(/101/);
        expect(element).toBeInTheDocument();
    });
});