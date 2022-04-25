import { screen, render } from '@testing-library/react';
import { AdminCoursePanel } from '../../../Components/Admin/AdminCoursePanel';

jest.mock('../../../Components/Admin/AdminCourseList');
jest.mock('../../../Components/Admin/SectionEditButton');
jest.mock('../../../Components/Misc/ChangeoverFileUploadButton');
jest.mock('../../../Components/Misc/ExportFileButton');

describe("AdminCoursePanel", () => {
  it("renders a AdminCourseList", () => {
    render(<AdminCoursePanel />);
    expect(screen.getByTestId("AdminCourseList")).toBeInTheDocument();
  })
  
  it("renders a SectionEditButton", () => {
    render(<AdminCoursePanel />);
    expect(screen.getByTestId("SectionEditButton")).toBeInTheDocument();
  })
  
  it("renders a ChangeoverFileUploadButton", () => {
    render(<AdminCoursePanel />);
    expect(screen.getByTestId("ChangeoverFileUploadButton")).toBeInTheDocument();
  })
  
  it("renders a ExportFileButton", () => {
    render(<AdminCoursePanel />);
    expect(screen.getByTestId("ExportFileButton")).toBeInTheDocument();
  })
  

})