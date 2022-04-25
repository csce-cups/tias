import React, { FC, useContext, useState } from 'react'
import { contexts } from '../../../Components/APIContextHelper'
import { Person } from '../../../modules/API'
import colorFromId from '../../../modules/color'
import { render, screen, fireEvent } from "@testing-library/react";
import { Hat } from '../../../Components/Misc/Hat';
import {APINoAsync} from '../../../modules/__mocks__/API'
import { ExportFileButton } from '../../../Components/Misc/ExportFileButton';
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe("ExportFileButton", ()=>{
    describe("Interaction", ()=>{
        it("Click",()=>{
            render(<ExportFileButton/>)
            // const button = screen.getByTestId("export-courses-button");
            const button = screen.getByText("Export Schedule as TSV files") // in case the above does not work
            // button.click();

            //what to check??????
        })
    })
})