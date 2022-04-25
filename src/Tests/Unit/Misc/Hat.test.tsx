import React, { FC, useContext, useState } from 'react'
import { contexts } from '../../../Components/APIContextHelper'
import { Person } from '../../../modules/API'
import colorFromId from '../../../modules/color'
import { render, screen, fireEvent } from "@testing-library/react";
import { Hat } from '../../../Components/Misc/Hat';
import { Dot } from '../../../Components/Misc/Dot';

import {APINoAsync} from '../../../modules/__mocks__/API'
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
// jest.mock('../../../Components/modules/API');
const people = APINoAsync.fetchPTList()
describe("Hat",()=>{
    const generateHats = () => {
        people.forEach(p => render(
            <contexts.employees.Provider value={[people, ()=>[]]}>
                < Hat linkID={p.person_id} />
            </contexts.employees.Provider>
            )
        );
    }

    describe("Content", ()=>{
        it("Invalid ID",()=>{
            render(<Hat linkID={-1}/>)
            expect(screen.getByText("UNSCHEDULED")).toBeInTheDocument();
        })
        it("Has correct name", ()=>{
            generateHats()
            people.forEach((p)=>{
                expect(screen.getByText(`${p?.first_name} ${p?.last_name}`)).toBeInTheDocument();
            })
        })
        it("Clickable",()=>{
            render(
                <contexts.employees.Provider value={[people, ()=>[]]}>
                    <Dot linkID={people[0].person_id} isScheduled={true}/>
                    <Hat linkID={people[0].person_id}/>
                </contexts.employees.Provider>)
            const button = screen.getByTitle(`${people[0]?.first_name} ${people[0]?.last_name}`);
            fireEvent.click(button);
            expect(screen.getByText(`${people[0]?.first_name} ${people[0]?.last_name}`)).toBeInTheDocument();

        })
    })
})