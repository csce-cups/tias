import React from 'react';
import { render, screen } from '@testing-library/react';
import { AcceptButton } from '../../../Components/EmployeeList/AcceptButton';


describe('AcceptButton', () => {    
    it('should say accept', () => {
        render(< AcceptButton />);
        const text = screen.getByText(/Accept/i);
        expect(text).toBeInTheDocument();
    });

    it.todo("Accepts the schedule");
});