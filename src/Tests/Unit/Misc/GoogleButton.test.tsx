import { render, screen } from '@testing-library/react';
import { GoogleButton } from '../../../Components/Misc/GoogleButton';
jest.mock('../../../Components/APIContext');

describe('GoogleButton', () => {
    describe('user is not signed in', () => {
        it('should say Sign in with Google', () => {
            render(<GoogleButton/>);
            expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
        });
    });

    describe('user is signed in', () => {
        it('should include Logged in as', () => {
            render(<GoogleButton/>);
            expect(screen.getByText('Logged in as')).toBeInTheDocument();
        });
    });

    it.todo("Test the callback function");
    it.todo("Need to figure out how to spy the login function");
});