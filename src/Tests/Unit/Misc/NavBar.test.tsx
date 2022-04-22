import React, {useContext} from 'react';
import { render, screen } from '@testing-library/react';
import { NavBar } from '../../../Components/Misc/NavBar';
import { MemoryRouter as Router } from 'react-router-dom';
import contexts from '../../../Components/APIContext';

jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe('Navbar', () => {
    it('has all the links', () => {
        render(
            <contexts.employees.Provider value={[[], () => {}]}>
                <Router>
                    <NavBar/>
                </Router>
            </contexts.employees.Provider>
        )
        expect(screen.getByText('TIAS')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Scheduling')).toBeInTheDocument();
        expect(screen.getByText('LabSwap™')).toBeInTheDocument();
    })

    it('should link to the proper pages', () => {
        render(
            <Router>
                <NavBar/>
            </Router>
        )
        expect(screen.getByText('TIAS')).toHaveAttribute("href", "/");
        expect(screen.getByText('Profile')).toHaveAttribute("href", "/profile");
        expect(screen.getByText('Scheduling')).toHaveAttribute("href", "/scheduling");
        expect(screen.getByText('LabSwap™')).toHaveAttribute("href", "/labswap");
    })

}); 