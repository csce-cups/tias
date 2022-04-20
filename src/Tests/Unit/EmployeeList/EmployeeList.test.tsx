import { render, screen } from '@testing-library/react';
import { EmployeeList } from '../../../Components/EmployeeList/EmployeeList';
import { Person } from '../../../modules/API';
import contexts, { APIContext } from '../../../Components/APIContext';

jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/EmployeeList/EmployeeRow');
jest.mock('../../../Components/EmployeeList/GenerateButton')
jest.mock('../../../Components/EmployeeList/LoadButton')
jest.mock('../../../Components/EmployeeList/SaveButton')

describe('EmployeeList', () => {
    const employees: Person[] = [
        {
            person_id: 1,
            first_name: 'Abby',
            last_name: 'Zebra',
            email: '',
            profile_photo_url: '',
            peer_teacher: true,
            teaching_assistant: false,
            administrator: false,
            professor: false,
            isScheduled: null,
            isChecked: true,
            desired_number_assignments: 2
        }, 
        {
            person_id: 2,
            first_name: 'Billy',
            last_name: 'Yvetal',
            email: '',
            profile_photo_url: '',
            peer_teacher: true,
            teaching_assistant: false,
            administrator: false,
            professor: false,
            isScheduled: null,
            isChecked: true,
            desired_number_assignments: 2
        }, 
        {
            person_id: 3,
            first_name: 'Carl',
            last_name: 'Xylyx',
            email: '',
            profile_photo_url: '',
            peer_teacher: true,
            teaching_assistant: false,
            administrator: false,
            professor: false,
            isScheduled: null,
            isChecked: true,
            desired_number_assignments: 2
        }, 
        {
            person_id: 4,
            first_name: 'Dan',
            last_name: 'Willy',
            email: '',
            profile_photo_url: '',
            peer_teacher: false,
            teaching_assistant: false,
            administrator: false,
            professor: false,
            isScheduled: null,
            isChecked: true,
            desired_number_assignments: 2
        }, 
    ];

    it('lists all employees', () => {
        render(
            < APIContext >
                < contexts.employees.Provider value={[employees, () => {}]}>
                    <EmployeeList editingState={{
                        bool: [false, () => {}],
                        count: [0, () => {}]
                    }}/>
                </contexts.employees.Provider>
            </APIContext>
        );

        expect(screen.getByText('Abby Zebra')).toBeInTheDocument();
        expect(screen.getByText('Billy Yvetal')).toBeInTheDocument();
        expect(screen.getByText('Carl Xylyx')).toBeInTheDocument();
        expect(screen.getByText('Dan Willy')).toBeInTheDocument();
    })
    
});