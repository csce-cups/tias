import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScheduleList } from '../../../Components/ScheduleList/ScheduleList';

jest.mock("../../../Components/ScheduleList/ScheduleRow", () => {
    return {
        __esModule: true,
        ScheduleRow: (props: any) => {
            return <div data-testid={props.element}/>
        }
    }
})

describe('ScheduleList', () => {
    const items = ["98%", "97%", "95%", "92%", "91%", "90%", "87%"];
    beforeEach(() => render(< ScheduleList data={items}/>));
    
    it('displays the data it was given', () => {
        items.forEach(e => {
            const name = screen.getByTestId(e);
            expect(name).toBeInTheDocument();
        })
    });

    it('does not display data it wasn\'t given', () => {
        ['2%', '3%', '4%'].forEach(name => {
            screen.findByTestId(name).then(e => {
                expect(e).toBe({});
            })
        })
    });
});