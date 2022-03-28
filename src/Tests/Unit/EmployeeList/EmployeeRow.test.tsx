import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import { EmployeeRow } from '../../../Components/EmployeeList/EmployeeRow';
import { APIPerson } from '../../../modules/API';

configure({testIdAttribute: 't-id'});

describe('EmployeeRow', () => {
    it('has a checkbox', () => {
        render(< EmployeeRow employee={{} as APIPerson} linkID={1} />);
        const element = screen.getByRole('checkbox');
        expect(element).toBeInTheDocument();
    });
    
    it('displays the name', () => {
        render(< EmployeeRow employee={{} as APIPerson} linkID={1} />);
        const text = screen.getByText(/John Doe/i);
        expect(text).toBeInTheDocument();
    });
});