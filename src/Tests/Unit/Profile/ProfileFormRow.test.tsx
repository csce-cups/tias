import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileFormRow } from '../../../Components/Profile/ProfileFormRow';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileFormRow', () => {
    it('renders properly', () => {
       //render(<ProfileFormRow/>); 
    });
}); 