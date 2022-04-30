import React, {useContext} from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProfileStatusBar, parseICSFile } from '../../../Components/Profile/ProfileStatusBar';
import API from '../../../modules/API';
const fs = require('fs');

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileStatusBar', () => {
    describe('button', () => {
        it('has a button', () => {
            render(<ProfileStatusBar/>);
            expect(screen.getByText('Upload Schedule')).toBeInTheDocument();
        });
        
        it("doesn't crash on click", () => {
            render(< ProfileStatusBar />);
            const button = screen.getByText('Upload Schedule');
            button.click();
        }); 

        it('parses ics files', async () => {
            const spy = jest.spyOn(API, 'saveUserUnavailability');
            const update = jest.spyOn(API, 'fetchUserViableCourses');
            render(<ProfileStatusBar/>);

            const file = fs.readFileSync('./src/tests/Unit/Profile/schedule.ics', 'utf8');
            parseICSFile(file, {user: null}, () => {});
            expect(spy).toHaveBeenCalled();

            await waitFor(() => {
                expect(update).toHaveBeenCalled();
            })

            await waitFor(() => {
                expect(screen.getByText(/Successful/i)).toBeInTheDocument();
            });
        });

        it('handles save API failure', async () => {
            const spy = jest.spyOn(API, 'saveUserUnavailability').mockImplementation(() => new Promise<void>((res, rej) => rej()));
            render(<ProfileStatusBar/>);

            const file = fs.readFileSync('./src/tests/Unit/Profile/schedule.ics', 'utf8');
            parseICSFile(file, {user: null}, () => {});
            expect(spy).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
            });
        });

        it('fails on bad ics files', async () => {
            render(<ProfileStatusBar/>);

            const file = fs.readFileSync('./src/tests/Unit/Profile/bad_schedule.ics', 'utf8');
            parseICSFile(file, {user: null}, () => {});
            expect(screen.getByText('An error occurred reading the file.')).toBeInTheDocument();
        })
    });
}); 