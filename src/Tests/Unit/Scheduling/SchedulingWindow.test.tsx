import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingWindow } from '../../../Components/Scheduling/SchedulingWindow';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';

jest.mock("../../../Components/Scheduling/SchedulingRender")
jest.mock("../../../Components/Scheduling/SchedulingFilter")

describe('SchedulingWindow', () => {
    it('displays the render, and filter', () => {
        render(< SchedulingWindow renderBlockType={SchedulingBlock}/>)
        expect(screen.getByTestId('SchedulingRender')).toBeInTheDocument();
    });

    it('displays the filter', () => {
        render(< SchedulingWindow renderBlockType={SchedulingBlock}/>)
        expect(screen.getByTestId('SchedulingFilter')).toBeInTheDocument();
    });
});