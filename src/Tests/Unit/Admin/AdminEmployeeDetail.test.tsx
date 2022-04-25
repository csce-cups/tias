import { screen, render, waitFor } from '@testing-library/react';
import { AdminEmployeeDetail } from '../../../Components/Admin/AdminEmployeeDetail';
import { APIContext } from '../../../Components/APIContext';
import { APINoAsync } from '../../../modules/__mocks__/API';

jest.mock('../../../Components/Scheduling/SchedulingWindow');
jest.mock('../../../modules/API');
jest.mock('../../../Components/APIContext');

describe('AdminEmployeeDetail', () => {
  const employee = APINoAsync.fetchPTList()[0];

  it("shows a render window when activated", async () => {
    render(
      <APIContext>
        <AdminEmployeeDetail employee={employee}/>
      </APIContext>
    );
    const button = screen.getByRole("button");
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('SchedulingWindow')).toBeInTheDocument();
    });
    
    const exit = screen.getAllByRole("button")[0];
    exit.click();

    await waitFor(() => {
      expect(screen.queryByTestId('SchedulingWindow')).not.toBeInTheDocument();
    });
  })
});