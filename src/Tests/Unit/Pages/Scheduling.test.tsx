import React from 'react';
import { render, screen } from '@testing-library/react';
import { Scheduling } from '../../../pages/Scheduling'

jest.mock('../../../Components/Misc/NavBar');
jest.mock('../../../Components/EmployeeList/EmployeeList');
jest.mock('../../../Components/Scheduling/SchedulingWindow');

describe('App', () => {
    describe('scheduling page', () => {
        it.todo('renders the navbar');
        it.todo('renders the employee list');
        it.todo('renders the scheduling window');
    })
});