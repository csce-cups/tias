import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileSidebar } from '../../../Components/Profile/ProfileSidebar';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
import { Person } from '../../../modules/API';


describe('ProfileSidebar', () => {
    it('renders properly', () => {
      render(<ProfileSidebar/>); 
    });

    it.todo('test the date stuff');
}); 