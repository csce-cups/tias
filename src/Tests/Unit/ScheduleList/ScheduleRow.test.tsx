import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScheduleRow } from '../../../Components/ScheduleList/ScheduleRow';


describe('ScheduleRow', () => {
    beforeEach(() => render(< ScheduleRow element={'foo'} />));
    
    it('displays an image', () => {
        const element = screen.getByRole('img');
        expect(element).toBeInTheDocument();
    })

    it('displays it\'s label', () => {
        const element = screen.getByText('foo');
        expect(element).toBeInTheDocument();
    })
});