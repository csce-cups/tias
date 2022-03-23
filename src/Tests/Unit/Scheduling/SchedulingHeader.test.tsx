import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingHeader } from '../../../Components/Scheduling/SchedulingHeader';


describe('SchedulingHeader', () => {
    it('displays "Current Schedule:"', () => {
        render(< SchedulingHeader />)
        const element = screen.getByText(/current schedule/i);
        expect(element).toBeInTheDocument();
    });
});