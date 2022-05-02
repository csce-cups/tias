import { render, screen, waitFor } from '@testing-library/react';
import contexts, { APIContext } from '../../../Components/APIContext';
import { ProfileForm } from '../../../Components/Profile/ProfileForm';
import API from '../../../modules/API';
import { ContextSetterSpy } from '../../helpers/ContextSetterSpy';


jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe('ProfileForm', () => {
    it('includes the Course Qualifications dropdown', () => {
       render(<ProfileForm />); 
       expect(screen.getByText('Course Qualifications')).toBeInTheDocument();
       expect(screen.getByText('Save Qualifications')).toBeInTheDocument();
    });

    it('uncollapses on click', () => {
        render(<ProfileForm />)
        
        const header = screen.getByText('Course Qualifications');
        expect(header.parentElement?.classList).toContain('collapsed');
        header.click();
        expect(header.parentElement?.classList).not.toContain('collapsed');
    });

    it('changes display when there are no courses', () => {
        render(
            < APIContext >
                < ContextSetterSpy what={contexts.userQuals} value={[]} >
                    <ProfileForm />
                </ContextSetterSpy>
            </APIContext>
        );

        expect(screen.getByText('Nothing to display')).toBeInTheDocument();
    })

    it('calls the api when save qualifications is clicked', async () => {
        const spy = jest.spyOn(API, 'sendUserQualifications');
        render(
            < APIContext >
                <ProfileForm />
            </APIContext>
        );
        const header = screen.getByText('Course Qualifications');
        header.click();

        const submitButton = screen.getByText('Save Qualifications');
        submitButton.click();

        expect(spy).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByText('Qualifications Saved!')).toBeInTheDocument();
        });
    })
}); 