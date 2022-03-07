import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavBar } from '../../../Components/Misc/NavBar';


describe('Navbar', () => {
    beforeEach(() => render(< NavBar />));
    
    it('has all the links', () => {
        expect(screen.getByText('TIAS')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Scheduling')).toBeInTheDocument();
        expect(screen.getByText('LabSwap™')).toBeInTheDocument();
    })
});