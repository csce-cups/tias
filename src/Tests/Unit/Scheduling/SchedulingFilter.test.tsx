import React from 'react';
import { render, screen } from '@testing-library/react';
import { SchedulingFilter } from '../../../Components/Scheduling/SchedulingFilter';
import { APIContext } from '../../../Components/APIContext';

jest.mock('../../../Components/APIContext')

describe('SchedulingFilter', () => {
    let map: Map<number, boolean>;
    beforeEach(() => {
        map = new Map([
            [121, true],
            [221, true],
            [312, true],
            [313, true],
            [314, true],
            [315, true]
        ]);
    })

    describe("display", () => {
        it('displays courses', () => {
            render(
                <APIContext>
                    < SchedulingFilter filter={map} setFilter={() => {}}/>
                </APIContext>
            )
    
            expect(screen.getByText("121")).toBeInTheDocument();
            expect(screen.getByText("221")).toBeInTheDocument();
            expect(screen.getByText("312")).toBeInTheDocument();
            expect(screen.getByText("313")).toBeInTheDocument();
            expect(screen.getByText("314")).toBeInTheDocument();
            expect(screen.getByText("315")).toBeInTheDocument();
        })
    
        it('has has a show none button', () => {
            render(
                <APIContext>
                    < SchedulingFilter filter={map} setFilter={() => {}}/>
                </APIContext>
            )

            expect(screen.getByText(/show none/i)).toBeInTheDocument();
        });

        it('has has a show all button when a filter is active', () => {
            map.forEach((value, key) => map.set(key, key !== 121));
            render(
                <APIContext>
                    < SchedulingFilter filter={map} setFilter={() => {}}/>
                </APIContext>
            )

            expect(screen.getByText(/show all/i)).toBeInTheDocument();
        });
    });

    describe("function", () => {
        it("toggles filter when clicked", () => {
            const setFilter = jest.fn();
            render(
                <APIContext>
                    < SchedulingFilter filter={map} setFilter={setFilter}/>
                </APIContext>
            )

            const btn = screen.getByText("221");
            btn.click();
            expect(setFilter).toHaveBeenCalledWith(new Map([
                [121, true],
                [221, false],
                [312, true],
                [313, true],
                [314, true],
                [315, true]
            ]));
        });

        it("restores filter when 'Show all' is clicked", () => {
            const setFilter = jest.fn();
            map.forEach((value, key) => map.set(key, false));
            render(
                <APIContext>
                    < SchedulingFilter filter={map} setFilter={setFilter}/>
                </APIContext>
            )

            const btn = screen.getByText(/show all/i);
            btn.click();
            expect(setFilter).toHaveBeenCalledWith(new Map([
                [121, true],
                [221, true],
                [312, true],
                [313, true],
                [314, true],
                [315, true]
            ]));
        })
    })
});