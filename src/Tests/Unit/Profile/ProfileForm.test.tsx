import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileForm } from '../../../Components/Profile/ProfileForm';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileForm', () => {
    it('renders properly', () => {
       render(<ProfileForm/>); 
       expect(screen.getByText('Course Qualifications')).toBeInTheDocument();
       expect(screen.getByText('Save Qualifications')).toBeInTheDocument();
    });

    it('should save qualifications when button is clicked', () => {
        const spy = jest.spyOn(API, 'sendSavedSchedule');
        render(
            < contexts.userQuals.Provider value={[[], () => {}]}>
                <ProfileForm />
            </ contexts.userQuals.Provider >
        )

        const button = screen.getByRole('button');
        button.click();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
    }); 

    it('should fetch viable courses when button is clicked', () => {
        const spy = jest.spyOn(API, 'fetchUserViableCourses');
        render(
            < contexts.userQuals.Provider value={[[], () => {}]}>
                <ProfileForm />
            </ contexts.userQuals.Provider >
        )

        const button = screen.getByRole('submit-button');
        button.click();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
    }); 

}); 