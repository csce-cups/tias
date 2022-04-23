import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { PreferenceBlock } from '../../../Components/Profile/PreferenceBlock';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
import { CompressedCourseBlock } from '../../../modules/BlockFunctions';
import RenderBlockProps, { blockColors, calcFlex, statusColors } from '../../../Components/Scheduling/BlockBase';

interface Props extends RenderBlockProps {
    data: {
      course_instance: CompressedCourseBlock
      linkIDs: number[] | null
    }
  }



describe('PreferenceBlock', () => {
    it('renders properly', () => {
       //render(<PreferenceBlock data={Props.data} visible={false}/>); 
    });

    //issue: can't figure out how to render it/pass in data properly
}); 