import { render, screen, waitFor } from "@testing-library/react";
import { LabSwap } from "../../../Components/LabSwap/LabSwap";

jest.mock("../../../Components/APIContext");
jest.mock("../../../Components/LabSwap/SwapSet");
jest.mock("../../../Components/LabSwap/TitleSet");

describe("LabSwap", () => {
  describe("initial", () => {
    it('renders a schedule window', () => {
      render(<LabSwap />);
      expect(screen.getByTestId("SchedulingWindow")).toBeInTheDocument();
    })
  
    it('renders a title set', () => {
      render(<LabSwap />);
      expect(screen.getByTestId("TitleSet")).toBeInTheDocument();
    });
  
    it('renders a swap set', () => {
      render(<LabSwap />);
      expect(screen.getByTestId("SwapSet")).toBeInTheDocument();
    });
  });

  it("functionality tested through integration", () => {});
});
