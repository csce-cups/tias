import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileFormRow } from '../../../Components/Profile/ProfileFormRow';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileFormRow', () => {
    it('renders properly', () => {
       render(<ProfileFormRow course_id={-1} course_name={"none"} qual={false} key={`pfrow-none`}/>); 
    });

    it('updates properly', () => {
        render(<ProfileFormRow course_id={-1} course_name={"none"} qual={false} key={`pfrow-none`}/>); 
        const button = screen.getByRole('fill');
        button.click();
     });

   //need to test what happens when update is called
}); 