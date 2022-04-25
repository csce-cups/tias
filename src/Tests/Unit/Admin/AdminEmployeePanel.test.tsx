import { render, screen, waitFor } from '@testing-library/react';
import { AdminEmployeePanel } from '../../../Components/Admin/AdminEmployeePanel';
import { APIContext } from '../../../Components/APIContext';

jest.mock('../../../Components/APIContext');
jest.mock('../../../Components/Admin/AdminEmployee');
jest.mock('../../../modules/API');

describe("Admin", () => {
  it("renders the employees", async () => {
    render(
      <APIContext>
        <AdminEmployeePanel />
      </APIContext>
    );
    await waitFor(() => {
      expect(screen.getAllByTestId("AdminEmployee").length).toBeGreaterThan(0);
    })
  });
});