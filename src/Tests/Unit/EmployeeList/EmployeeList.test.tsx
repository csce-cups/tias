import React, { createContext } from 'react';
import { render, screen } from '@testing-library/react';
import { EmployeeList } from '../../../Components/EmployeeList/EmployeeList';

jest.mock('../../../Components/EmployeeList/EmployeeRow', () => {
    return {
        __esModule: true,
        EmployeeRow: (props: any) => {
            return <div data-testid={props.element}/>
        }
    }
})

describe('EmployeeList', () => {
    const folks = ["Abby Apple", "Bob Banana", "Charles Cherry"];
    const renderSubject = () => {
        render(< EmployeeList editingState={[false, 0 as any]}/>)
    }

    it('has a generate button', () => {
        renderSubject();

        const element = screen.getByRole('button', {name: /generate/i});
        expect(element).toBeInTheDocument();
    });

    it('has an accept button', () => {
        renderSubject();

        const element = screen.getByRole('button', {name: /accept/i});
        expect(element).toBeInTheDocument();
    });

    it('has a top label', () => {
        renderSubject();

        const element = screen.getByText('Employee');
        expect(element).toBeInTheDocument();
    });

    it('displays the data it was given', () => {
        renderSubject();

        folks.forEach(e => {
            const name = screen.getByTestId(e);
            expect(name).toBeInTheDocument();
        })
    });

    it('does not display data it wasn\'t given', () => {
        renderSubject();

        ['Danny Durian', 'Elena Eggplant'].forEach(name => {
            screen.findByTestId(name).then(e => {
                expect(e).toBe({});
            })
        })
    });
});