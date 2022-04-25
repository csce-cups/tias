import React, {useContext} from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
        const e = document.getElementById('${course_name}-prefs') as HTMLSelectElement;
        e.onchange;
        const select = screen.getByRole('select');
        select.click();
        fireEvent.change(select, {
         //   target: {value: click}
        })
     });

   //still isn't testing update? 
}); 