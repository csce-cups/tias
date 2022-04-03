import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { GenerateButton } from '../../../Components/EmployeeList/GenerateButton';


describe('GenerateButton', () => {
    it('should have label text', () => {
        render(< GenerateButton genState={useState<boolean>(false)}/>);
        const text = screen.getByText(/Generate/i);
        expect(text).toBeInTheDocument();
    });

    it.todo("generates schedules");
});