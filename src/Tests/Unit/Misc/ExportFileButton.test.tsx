import { render, screen } from "@testing-library/react";
import React from "react";
import { ExportFileButton } from "../../../Components/Misc/ExportFileButton";
import API from "../../../modules/API";
import { APINoAsync } from "../../../modules/__mocks__/API";

jest.mock("../../../modules/API");
jest.mock("../../../Components/APIContext");

describe("ExportFileButton", () => {
  it("does the thing", () => {
    const spy = jest.spyOn(API, 'fetchExportedSchedule').mockImplementation(() => new Promise(r => r(APINoAsync.fetchExportedSchedule() as any)));
    render(<ExportFileButton />);

    const button = screen.getByText("Export Schedule as TSV files");
    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
