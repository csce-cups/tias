import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingRender } from '../../../Components/Scheduling/SchedulingRender';

jest.mock("../../../Components/Scheduling/SchedulingColumn", () => {
    return {
        __esModule: true,
        SchedulingColumn: () => {
            return <div data-testid="column"/>
        }
    }
})

describe('SchedulingRender', () => {
    it('renders 5 days', () => {
        render(< SchedulingRender filter={{}} />)
        expect(screen.getAllByTestId('column').length).toEqual(5);
    });
});