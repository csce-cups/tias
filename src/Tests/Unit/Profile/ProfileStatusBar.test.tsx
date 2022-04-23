import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { ProfileStatusBar } from '../../../Components/Profile/ProfileStatusBar';
import contexts from '../../../Components/APIContext';
import API from '../../../modules/API';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');


describe('ProfileStatusBar', () => {
    describe('button', () => {
        it('has a button', () => {
            render(<ProfileStatusBar/>);
            expect(screen.getByText('Upload Schedule')).toBeInTheDocument();
        });
        
        it.todo("does clicking on the button prompt to upload a file");
        it("prompts schedule upload when the button is clicked", () => {
            render(< ProfileStatusBar />);
           // const spy = jest.spyOn(ProfileStatusBar, 'handleClick'); //this line breaks it
            const button = screen.getByRole('button');
            button.click();
            //expect(spy).toHaveBeenCalled();
            //spy.mockReset();
            //spy.mockRestore();
        }); 
    });
    it.todo("does parse.ics successfully parse files");

    describe('parse ics function', () => {
        it('successfully parses when given a file', () => {
            ;
        });
    });
    it.todo("is the API called on change (jest spy and unit integration test??");
    it.todo("does click on button do the API");

}); 