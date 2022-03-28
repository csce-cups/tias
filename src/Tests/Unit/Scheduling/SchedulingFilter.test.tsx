import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingFilter } from '../../../Components/Scheduling/SchedulingFilter';


describe('SchedulingFilter', () => {
    it('displays courses', () => {
        render(< SchedulingFilter filter={{}} setFilter={() => {}}/>)

        expect(screen.getByText(/121/)).toBeInTheDocument();
        expect(screen.getByText(/221/)).toBeInTheDocument();
        expect(screen.getByText(/312/)).toBeInTheDocument();
        expect(screen.getByText(/313/)).toBeInTheDocument();
        expect(screen.getByText(/314/)).toBeInTheDocument();
        expect(screen.getByText(/315/)).toBeInTheDocument();
    })

    it.todo('has has a show all button');
    it.todo('has has a show none button');

    it.todo('filters blocks');
});