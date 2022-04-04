import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingRender } from '../../../Components/Scheduling/SchedulingRender';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';

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
        render(< SchedulingRender renderBlockType={SchedulingBlock} filter={new Map<number, boolean>()} />)
        expect(screen.getAllByTestId('column').length).toEqual(5);
    });
});