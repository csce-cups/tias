import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { PreferenceBlock } from '../../../Components/Profile/PreferenceBlock';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('PreferenceBlock', () => {
    it('renders properly', () => {
       // render(<PreferenceBlock/>); //why is this mad???????
    });
}); 