import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingRender } from '../../../Components/Scheduling/SchedulingRender';
import { SchedulingBlock } from '../../../Components/Scheduling/SchedulingBlock';
import contexts, { APIContext } from '../../../Components/APIContext';
import { APINoAsync } from '../../../modules/__mocks__/API';
import { ContextSetterSpy } from '../../helpers/ContextSetterSpy';
import { CourseBlock, CourseBlockWeekKey } from '../../../modules/API';

jest.mock("../../../Components/Scheduling/SchedulingColumn");
jest.mock('../../../Components/APIContext');

// We create a mock here so we can intercept the hours and start time that SchedulingRender produces
const mockHours = jest.fn();
const mockStart = jest.fn();
interface Props {
  hours: number
  start: Date
  editing?: {
    bool: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    count: [number, React.Dispatch<React.SetStateAction<number>>]
  }
}
jest.mock("../../../Components/Scheduling/SchedulingTimes", () => {
    return {
        __esModule: true,
        SchedulingTimes: (props: Props) => {
            mockHours(props.hours);
            mockStart(props.start);
            return <div data-testid="SchedulingTimes"/>
        }
    }
});

describe('SchedulingRender', () => {
    afterEach(() => {
        mockHours.mockClear();
        mockStart.mockClear();
    })

    it('renders 5 days', () => {
        render(< SchedulingRender renderBlockType={SchedulingBlock} filter={new Map<number, boolean>()} />)
        expect(screen.getAllByTestId('column').length).toEqual(5);
    });

    it('dynamically determines the hours in a day', () => {
        const blocks = APINoAsync.fetchCourseBlocks();
        render(
            < APIContext >
                < ContextSetterSpy what={contexts.blocks} value={blocks}>
                    < SchedulingRender renderBlockType={SchedulingBlock} filter={new Map<number, boolean>()} />
                </ContextSetterSpy>
            </APIContext>
        );

        let start: CourseBlock | undefined = undefined;
        let end: CourseBlock | undefined = undefined;
        (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as CourseBlockWeekKey[]).forEach(key => {
            const dayFirst = blocks[key]?.reduce((acc, curr) => (curr.start_time < acc.start_time ? curr : acc));
            start = (!start || dayFirst!.start_time < start.start_time)? dayFirst : start;

            const dayLast = blocks[key]?.reduce((acc, curr) => (curr.end_time > acc.end_time ? curr : acc));
            end = (!end || dayLast!.end_time > end.end_time)? dayLast : end;
        });

        start!.start_time.setMinutes(0);
        const length = Math.ceil((end!.end_time.getTime() - start!.start_time.getTime()) / 1000 / 60 / 60);

        expect(mockHours).toHaveBeenCalledWith(length);
        expect(mockStart).toHaveBeenCalledWith(start!.start_time);
    });
});