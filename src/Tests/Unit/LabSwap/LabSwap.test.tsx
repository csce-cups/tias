import { LabSwap } from "../../../Components/LabSwap/LabSwap";
import { render, screen, waitFor } from '@testing-library/react';
import { contexts } from '../../../Components/APIContextHelper'

import {APINoAsync} from '../../../modules/__mocks__/API'
import { wait } from "@testing-library/user-event/dist/utils";
import {APIContext} from "../../../Components/APIContext";
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/LabSwap/LabSwapBlock');
describe("LabSwap",()=>{
    it("Select Trades", async () => {
        const view = render(
          <APIContext>
            <LabSwap/>
          </APIContext>
        )
        await waitFor(() => {
          const offers = screen.getAllByText("Request!!!");
          expect(offers.length).toBe(1);
        })
      })
})