import React from 'react';
import { render, RenderResult, screen, configure } from '@testing-library/react';
import { EmployeeRow } from '../../../Components/EmployeeList/EmployeeRow';
import { Dot } from '../../../Components/Misc/Dot';

configure({testIdAttribute: 't-id'});

describe('EmployeeRow', () => {
    let subject: RenderResult;
    beforeEach(() => subject = render(< EmployeeRow element={"John Doe"} tid={'1'}/>))
    
    it('has a checkbox', () => {
        const element = screen.getByRole('checkbox');
        expect(element).toBeInTheDocument();
    });
    
    it('displays the name', () => {
        const text = screen.getByText(/John Doe/i);
        expect(text).toBeInTheDocument();
    });

    it('contains a dot', () => {
        const dotSelector = {'class': 'dot'}
        expect(subject.getAllByTestId("1")).toContainEqual(dotSelector);
    })
});