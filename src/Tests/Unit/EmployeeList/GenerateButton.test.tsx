import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenerateButton } from '../../../Components/EmployeeList/GenerateButton';


describe('GenerateButton', () => {
    it('should have label text', () => {
        render(< GenerateButton />);
        const text = screen.getByText(/Generate/i);
        expect(text).toBeInTheDocument();
    });

    it.todo("generates schedules");
});