import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { APIContext } from "../../../Components/APIContext";
import { ChangeoverFileUploadButton, readInputFile } from "../../../Components/Misc/ChangeoverFileUploadButton";
import { APINoAsync } from "../../../modules/__mocks__/API";
const fs = require("fs");

jest.mock("../../../Components/APIContext");
jest.mock("../../../modules/API");

describe("ChangeoverFileUploadButton", () => {
  it("has a label", () => {
    render(
      <APIContext>
        <ChangeoverFileUploadButton />
      </APIContext>
    );
    expect(screen.getByText("Upload New Semester")).toBeInTheDocument();
  });

  it("warns when clicked", () => {
    render(
      <APIContext>
        <ChangeoverFileUploadButton />
      </APIContext>
    );
    screen.getByText("Upload New Semester").click();
    expect(screen.getByText("Upload block schedule")).toBeInTheDocument();
  });

  it("uploads a new semester with json", async () => {
    const alert = jest.spyOn(window, "alert").mockImplementation(() => {});
    const confirm = jest.spyOn(window, "confirm").mockImplementation(() => true);
    render(
      <APIContext>
        <ChangeoverFileUploadButton />
      </APIContext>
    );

    const file = new File([fs.readFileSync("./src/tests/Unit/Misc/ChangeoverFile.json")], "ChangeoverFile.json", {
      type: "application/json",
    });
    
    readInputFile(file, {...APINoAsync.fetchEveryone()[0], administrator: false});

    await waitFor(() => {
      expect(confirm).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(alert).toHaveBeenCalled();
    })

    alert.mockReset();
    confirm.mockReset();
    alert.mockRestore();
    confirm.mockRestore();
  })

  it("uploads a new semester with csv", async () => {
    const alert = jest.spyOn(window, "alert").mockImplementation(() => {});
    const confirm = jest.spyOn(window, "confirm").mockImplementation(() => true);
    render(
      <APIContext>
        <ChangeoverFileUploadButton />
      </APIContext>
    );

    const file = new File([fs.readFileSync("./src/tests/Unit/Misc/ChangeoverFile.json")], "ChangeoverFile.json", {
      type: "application/json",
    });
    
    readInputFile(file, {...APINoAsync.fetchEveryone()[0], administrator: false});

    await waitFor(() => {
      expect(confirm).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(alert).toHaveBeenCalled();
    })

    alert.mockReset();
    confirm.mockReset();
    alert.mockRestore();
    confirm.mockRestore();
  })

  it("can be cancelled", async () => {
    const alert = jest.spyOn(window, "alert").mockImplementation(() => {});
    const confirm = jest.spyOn(window, "confirm").mockImplementation(() => false);
    render(
      <APIContext>
        <ChangeoverFileUploadButton />
      </APIContext>
    );

    const file = new File([fs.readFileSync("./src/tests/Unit/Misc/ChangeoverFile.csv")], "ChangeoverFile.csv", {
      type: "application/csv",
    });
    
    readInputFile(file, {...APINoAsync.fetchEveryone()[0], administrator: false});

    await waitFor(() => {
      expect(confirm).toHaveBeenCalled();
    });

    expect(alert).not.toHaveBeenCalled();
  })
});
