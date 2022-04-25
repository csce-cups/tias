import React, {useContext} from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProfileForm } from '../../../Components/Profile/ProfileForm';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
import { click } from '@testing-library/user-event/dist/click';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileForm', () => {
    it('includes the Course Qualifications dropdown', () => {
       render(<ProfileForm/>); 
       expect(screen.getByText('Course Qualifications')).toBeInTheDocument();
       expect(screen.getByText('Save Qualifications')).toBeInTheDocument();
    });

    it('expands dropdowns when they are clicked', () => {
        render(<ProfileForm/>);
        const select = screen.getByRole('heading');
        select.click();
        fireEvent.change(select, {
            target: {value: click}
        })
        expect(screen.getByText('CSCE 110')).toBeInTheDocument();
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

    //most of the untested lines are after the PUT request
    //I tried to test the API hit with the third test but it 
    //didn't seem to set off the lines? 

}); 