import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { PreferenceSelector } from '../../../Components/Profile/PreferenceSelector';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('PreferenceSelector', () => {
    it('renders properly', () => {
       render(<PreferenceSelector/>); 
       expect(screen.getByText('Section Preferences')).toBeInTheDocument();
       expect(screen.getByText('Preferred Number of Lab Sections:')).toBeInTheDocument();
    });

    it('should update the desired number of labs', () => {
        const spy = jest.spyOn(API, 'sendUserPreferences');
        render(<PreferenceSelector/>);
        const button = screen.getByRole('button');
        button.click();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
    });

    it('should update preferences', () => { //this doesn't seem to catch the lines I meant it to? targeting line 34
        const spy = jest.spyOn(API, 'sendUserPreferences');
        render(<PreferenceSelector/>);
        const button = screen.getByRole('submit-prefs');
        button.setAttribute('value', 'Saved!');
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
        spy.mockRestore();
    });
}); 