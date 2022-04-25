import React, { useState } from 'react';
import { render, screen, configure } from '@testing-library/react';
import { EmployeeRow } from '../../../Components/EmployeeList/EmployeeRow';
import { Person } from '../../../modules/API';

describe('EmployeeRow', () => {
    let employee: Person = {} as any;

    beforeEach(() => {
        employee = {
            person_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: '',
            profile_photo_url: '',
            peer_teacher: true,
            teaching_assistant: false,
            administrator: false,
            professor: false,
            isScheduled: null,
            isChecked: true,
            desired_number_assignments: 2
        }
    });

    describe('checkbox', () => {
        it('has a checkbox', () => {
            render(<EmployeeRow employee={employee} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('is checked by default checkbox', () => {
            render(<EmployeeRow employee={employee} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByRole('checkbox')).toBeChecked();
        });

        it('can be unchecked by clicking on the box', () => {
            render(<EmployeeRow employee={employee} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            const checkbox: HTMLInputElement = screen.getByRole('checkbox');
            expect(checkbox).toBeChecked();
            checkbox.click();
            expect(checkbox).not.toBeChecked();
        });
    });

    describe('name', () => {
        it('has a name', () => {
            render(<EmployeeRow employee={employee} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('can be clicked to change the textbox', () => {
            render(<EmployeeRow employee={employee} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            const name = screen.getByText('John Doe');
            expect(screen.getByRole('checkbox')).toBeChecked();
            name.click();
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });

        it('is crossed out when not checked', () => {
            render(<EmployeeRow employee={{...employee, isChecked: false}} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByRole('checkbox')).not.toBeChecked();
            expect(screen.getByText('John Doe')).toHaveStyle('text-decoration: line-through');
        });

        it('is red when not scheduled', () => {
            render(<EmployeeRow employee={{...employee, isScheduled: false}} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByText('John Doe')).toHaveStyle('color: red');
        });
    });

    describe('dot', () => {
        it('creates a dot when scheduled', () => {
            render(<EmployeeRow employee={{...employee, isScheduled: true}} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByTestId('dot')).toHaveClass('dot');
        });
        
        it('creates a failed dot when not scheduled', () => {
            render(<EmployeeRow employee={{...employee, isScheduled: false}} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByTestId('dot')).toHaveClass('dot-failed');
        });

        it('creates nothing before scheduling', () => {
            render(<EmployeeRow employee={{...employee, isScheduled: null}} setEmployee={() => {}} linkID={1} genState={[false, () => {}]}/>);
            expect(screen.getByTestId('dot')).not.toHaveClass('dot');
            expect(screen.getByTestId('dot')).not.toHaveClass('dot-failed');
        });
    });

});