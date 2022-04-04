import React from 'react';
import { render, screen } from '@testing-library/react';
import contexts from '../../../Components/APIContext';
import API, { CourseBlockWeek } from '../../../modules/API';
import { LoadButton } from '../../../Components/EmployeeList/LoadButton';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe('LoadButton', () => {
    it('should say load schedule', () => {
        render(
            < contexts.loadedSchedule.Provider value={[new Map<string, number[]>(), () => {}]}>
                < LoadButton />
            </ contexts.loadedSchedule.Provider >
        )
        expect(screen.getByText('Load Saved Schedule')).toBeInTheDocument();
    });

    it('should load a schedule from server when clicked', () => {
        const spy = jest.spyOn(API, 'getSavedSchedule');
        render(
            < contexts.loadedSchedule.Provider value={[new Map<string, number[]>(), () => {}]}>
                < LoadButton />
            </ contexts.loadedSchedule.Provider >
        )

        const button = screen.getByRole('button');
        button.click();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
    }); 

    it('should change it\'s text when clicked', () => {
        render(
            < contexts.loadedSchedule.Provider value={[new Map<string, number[]>(), () => {}]}>
                < LoadButton />
            </ contexts.loadedSchedule.Provider >
        )

        const button = screen.getByRole('button');
        button.click();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    }); 

    it('should change it\'s text when finished', (done) => { // I don't know why the button doesn't change, so we go slow
        render(
            < contexts.loadedSchedule.Provider value={[new Map<string, number[]>(), () => {}]}>
                < LoadButton />
            </ contexts.loadedSchedule.Provider >
        )
        
        const button = screen.getByRole('button');
        button.click();
        setTimeout(() => {
            expect(screen.getByText('Schedule Loaded!')).toBeInTheDocument();
            done();
        }, 100);
    }); 

    it('should present a warning if a schedule is present', () => {
        const spy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
        render(
            <contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2]]]), () => {}]}>
                < LoadButton />
            </contexts.loadedSchedule.Provider>
        )

        const button = screen.getByRole('button');
        button.click();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
    });

    it('should save the schedule', (done) => {
        const fn = jest.fn();
        render(
            <contexts.loadedSchedule.Provider value={[new Map<string, number[]>(), fn]}>
                <contexts.employees.Provider value={[[], () => {}]}>
                    < LoadButton />
                </contexts.employees.Provider>
            </contexts.loadedSchedule.Provider>
        );

        const button = screen.getByRole('button');
        button.click();
        setTimeout(() => {
            expect(fn).toHaveBeenCalled();
            done();
        }, 100);
    })

    it('should update the blocks', (done) => {
        const fn = jest.fn();
        render(
            <contexts.blocks.Provider value={[{ Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null} as CourseBlockWeek, fn]}>
                <contexts.employees.Provider value={[[], () => {}]}>
                    < LoadButton />
                </contexts.employees.Provider>
            </contexts.blocks.Provider>
        );

        const button = screen.getByRole('button');
        button.click();
        setTimeout(() => {
            expect(fn).toHaveBeenCalled();
            done();
        }, 100);
    })

    it('should update the employees', (done) => {
        const fn = jest.fn();
        render(
            <contexts.employees.Provider value={[[], fn]}>
                < LoadButton />
            </contexts.employees.Provider>
        );

        const button = screen.getByRole('button');
        button.click();
        setTimeout(() => {
            expect(fn).toHaveBeenCalled();
            done();
        }, 100);
    })

});