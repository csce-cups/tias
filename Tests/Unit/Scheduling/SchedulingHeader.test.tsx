import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingHeader } from '../../../Components/Scheduling/SchedulingHeader';


describe('SchedulingHeader', () => {
    beforeEach(() => render(< SchedulingHeader />));
    
    it('displays "Current Schedule:"', () => {
        const element = screen.getByText(/current schedule/i);
        expect(element).toBeInTheDocument();
    });
});