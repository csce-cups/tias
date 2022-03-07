import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
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
    beforeEach(() => render(< EmployeeList data={folks}/>));

    it('has a generate button', () => {
        const element = screen.getByRole('button', {name: /generate/i});
        expect(element).toBeInTheDocument();
    });

    it('has an accept button', () => {
        const element = screen.getByRole('button', {name: /accept/i});
        expect(element).toBeInTheDocument();
    });

    it('has a top label', () => {
        const element = screen.getByText('Employee');
        expect(element).toBeInTheDocument();
    });

    it('displays the data it was given', () => {
        folks.forEach(e => {
            const name = screen.getByTestId(e);
            expect(name).toBeInTheDocument();
        })
    });

    it('does not display data it wasn\'t given', () => {
        ['Danny Durian', 'Elena Eggplant'].forEach(name => {
            screen.findByTestId(name).then(e => {
                expect(e).toBe({});
            })
        })
    });
});