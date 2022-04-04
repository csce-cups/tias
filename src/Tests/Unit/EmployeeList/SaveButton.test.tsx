import React from 'react';
import { render, screen } from '@testing-library/react';
import { SaveButton } from '../../../Components/EmployeeList/SaveButton';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
import { doesNotReject } from 'assert';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe('SaveButton', () => {    
    describe('inactive without loaded schedule', () => {
        it('should say there is nothing to save', () => {
            render(<SaveButton />);
            expect(screen.getByText('Nothing to Save')).toBeInTheDocument();
        });

        it('should be disabled', () => {
            render(<SaveButton />);
            expect(screen.getByRole('button')).toBeDisabled();
        });
    });

    describe('active with a loaded schedule', () => {
        it('should say save schedule', () => {
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )
            expect(screen.getByText('Save Schedule')).toBeInTheDocument();
        });

        it('should send the schedule to the server when clicked', () => {
            const spy = jest.spyOn(API, 'sendSavedSchedule');
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
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
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )

            const button = screen.getByRole('button');
            button.click();
            expect(screen.getByText('Saving...')).toBeInTheDocument();
        }); 

        it('should change it\'s text when finished', (done) => { // I don't know why the button doesn't change, so we go slow
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )
            
            const button = screen.getByRole('button');
            button.click();
            setTimeout(() => {
                expect(screen.getByText('Saved!')).toBeInTheDocument();
                done();
            }, 100);
        }); 
    });
});