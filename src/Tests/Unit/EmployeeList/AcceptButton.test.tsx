import React from 'react';
import { render, screen } from '@testing-library/react';
import { SaveButton } from '../../../Components/EmployeeList/SaveButton';


describe('AcceptButton', () => {    
    it('should say accept', () => {
        render(< SaveButton />);
        const text = screen.getByText(/Accept/i);
        expect(text).toBeInTheDocument();
    });

    it.todo("Accepts the schedule");
});