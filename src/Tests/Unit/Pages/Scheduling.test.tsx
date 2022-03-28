import React from 'react';
import { render, screen } from '@testing-library/react';
import { Scheduling } from '../../../pages/Scheduling'

jest.mock("../../Components/Misc/NavBar", () => {
    return {
        __esModule: true,
        NavBar: () => {
            return <div data-testid="NavBar"/>
        }
    }
})

jest.mock("../../Components/EmployeeList/EmployeeList", () => {
    return {
        __esModule: true,
        EmployeeList: () => {
            return <div data-testid="EmployeeList"/>
        }
    }
})

jest.mock("../../Components/Scheduling/SchedulingWindow", () => {
    return {
        __esModule: true,
        SchedulingWindow: () => {
            return <div data-testid="SchedulingWindow"/>
        }
    }
})

describe('App', () => {
    describe('scheduling page', () => {
        it('renders the navbar', () => {
            render(< Scheduling />);

            expect(screen.getByTestId('NavBar')).toBeInTheDocument();
        });
    
        it('renders the employee list', () => {
            render(< Scheduling />);

            expect(screen.getByTestId('EmployeeList')).toBeInTheDocument();
        });
    
        it('renders the scheduling window', () => {
            render(< Scheduling />);

            expect(screen.getByTestId('SchedulingWindow')).toBeInTheDocument();
        });
    })
});