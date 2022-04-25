import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SaveButton } from '../../../Components/EmployeeList/SaveButton';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';

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
        const sendSavedSchedule = jest.spyOn(API, 'sendSavedSchedule').mockImplementation(() => new Promise(res => res()));
        afterEach(() => {
            sendSavedSchedule.mockReset();
            sendSavedSchedule.mockRestore();
        })

        it('should say save schedule', () => {
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )
            expect(screen.getByText('Save Schedule')).toBeInTheDocument();
        });

        it('should send the schedule to the server when clicked', () => {
            const sendSavedSchedule = jest.spyOn(API, 'sendSavedSchedule').mockImplementation(() => new Promise(res => res()));
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )

            const button = screen.getByRole('button');
            button.click();
            expect(sendSavedSchedule).toHaveBeenCalled();
        });

        it('should change its text when clicked', () => {
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )

            const button = screen.getByRole('button');
            button.click();
            expect(screen.getByText('Saving...')).toBeInTheDocument();
        }); 

        it('should change its text when finished', async () => {
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )
            
            const button = screen.getByRole('button');
            button.click();
            await waitFor(() => {
                expect(screen.getByText('Saved!')).toBeInTheDocument();
            });
        }); 

        it('should report errors', async () => {
            jest.spyOn(API, 'sendSavedSchedule').mockImplementation(() => new Promise((res, rej) => rej()));
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>([['1', [1, 2, 3]]]), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )
            
            const button = screen.getByRole('button');
            button.click();
            await waitFor(() => {
                expect(screen.getByText(/error/i)).toBeInTheDocument();
            });
        });

        it('should report when there is nothing to save', () => {
            render(
                < contexts.loadedSchedule.Provider value={[new Map<string, number[]>(), () => {}]}>
                    <SaveButton />
                </ contexts.loadedSchedule.Provider >
            )

            const button = screen.getByRole('button');
            button.click();
            expect(screen.getByText('Nothing to Save')).toBeInTheDocument();
        })
    });
});