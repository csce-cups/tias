import { render, screen, waitFor } from '@testing-library/react';
import contexts, { APIContext } from '../../../Components/APIContext';
import { PreferenceSelector } from '../../../Components/Profile/PreferenceSelector';
import API from '../../../modules/API';
import { ContextSetterSpy } from '../../helpers/ContextSetterSpy';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/Scheduling/SchedulingWindow');


describe('PreferenceSelector', () => {
    it('includes the correct text', () => {
       render(<PreferenceSelector/>); 
       expect(screen.getByText('Section Preferences')).toBeInTheDocument();
       expect(screen.getByText('Preferred Number of Lab Sections:')).toBeInTheDocument();
    });

    describe("functionality", () => {
        it('uncollapses when clicked', () => {
            render(<PreferenceSelector/>);
            const titleBar = screen.getByText("Section Preferences");
            expect(titleBar.parentElement?.classList).toContain('collapsed');
            
            titleBar.click();
            expect(titleBar.parentElement?.classList).not.toContain('collapsed');
        });

        it('should update preferences', async () => {
            const spy = jest.spyOn(API, 'sendUserPreferences').mockImplementation(() => new Promise<void>(r => setTimeout(() => r(), 100)));
            const fn = jest.fn();
            render(
                <APIContext>
                    <ContextSetterSpy what={contexts.employees} spy={fn}>
                        <PreferenceSelector/>
                    </ContextSetterSpy>
                </APIContext>
            );
            
            const button = screen.getByRole('button', {name: 'Save Preferences'});
            button.click();
    
            expect(screen.getByText('Saving...')).toBeInTheDocument();
            expect(spy).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.getByText('Saved!')).toBeInTheDocument();
            })

            spy.mockReset();
            spy.mockRestore();
        });

        it('should say when there is an error', async () => {
            const spy = jest.spyOn(API, 'sendUserPreferences').mockImplementation(() => new Promise<void>((res, rej) => setTimeout(() => rej(), 100)));
            const fn = jest.fn();
            render(
                <APIContext>
                    <ContextSetterSpy what={contexts.employees} spy={fn}>
                        <PreferenceSelector/>
                    </ContextSetterSpy>
                </APIContext>
            );
            
            const button = screen.getByRole('button', {name: 'Save Preferences'});
            button.click();
    
            expect(screen.getByText('Saving...')).toBeInTheDocument();
            expect(spy).toHaveBeenCalled();

            await waitFor(() => {
                expect(screen.getByText('Preferences could not be saved.')).toBeInTheDocument();
            })

            spy.mockReset();
            spy.mockRestore();
        });
    })
}); 