import { screen, render, waitFor } from '@testing-library/react';
import { SectionEditButton } from '../../../Components/Admin/SectionEditButton';
import { APIContext } from '../../../Components/APIContext';

jest.mock('../../../Components/Scheduling/SchedulingWindow');
jest.mock('../../../Components/APIContext');

describe("SectionEditButton", () => {
  it("shows a render window when activated", async () => {
    render(
      <APIContext>
        <SectionEditButton/>
      </APIContext>
    );

    const button = screen.getByRole("button");
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('SchedulingWindow')).toBeInTheDocument();
    });

    const exit = screen.getAllByRole("button").filter(b => b.innerHTML === "Exit")[0];
    exit.click();

    await waitFor(() => {
      expect(screen.queryByTestId('SchedulingWindow')).not.toBeInTheDocument();
    });
  })
});