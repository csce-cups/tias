import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../Components/App';

jest.mock("../../Components/NavBar", () => {
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

jest.mock("../../Components/ScheduleList/ScheduleList", () => {
    return {
        __esModule: true,
        ScheduleList: () => {
            return <div data-testid="ScheduleList"/>
        }
    }
})

describe('App', () => {
    beforeEach(() => render(< App />));
    
    describe('scheduling page', () => {
        it('renders the navbar', () => {
            expect(screen.getByTestId('NavBar')).toBeInTheDocument();
        });
    
        it('renders the navbar', () => {
            expect(screen.getByTestId('EmployeeList')).toBeInTheDocument();
        });
    
        it('renders the navbar', () => {
            expect(screen.getByTestId('SchedulingWindow')).toBeInTheDocument();
        });
    
        it('renders the navbar', () => {
            expect(screen.getByTestId('ScheduleList')).toBeInTheDocument();
        });
    })
});