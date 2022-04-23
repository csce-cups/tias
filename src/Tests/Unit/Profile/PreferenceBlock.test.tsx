import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { PreferenceBlock } from '../../../Components/Profile/PreferenceBlock';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
//import { CompressedCourseBlock } from '../../../modules/BlockFunctions';



describe('PreferenceBlock', () => {
    it('renders properly', () => {
       //render(<PreferenceBlock data={null} visible={false}/>); 
    });
}); 