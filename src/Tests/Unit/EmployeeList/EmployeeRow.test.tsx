import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import { EmployeeRow } from '../../../Components/EmployeeList/EmployeeRow';

configure({testIdAttribute: 't-id'});

describe('EmployeeRow', () => {
    it('has a checkbox', () => {
        render(< EmployeeRow linkID={1} element={"John Doe"} />);
        const element = screen.getByRole('checkbox');
        expect(element).toBeInTheDocument();
    });
    
    it('displays the name', () => {
        render(< EmployeeRow linkID={1} element={"John Doe"} />);
        const text = screen.getByText(/John Doe/i);
        expect(text).toBeInTheDocument();
    });
});