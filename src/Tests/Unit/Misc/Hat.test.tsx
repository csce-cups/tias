import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { APIContext } from "../../../Components/APIContext";
import { contexts } from "../../../Components/APIContextHelper";
import { Dot } from "../../../Components/Misc/Dot";
import { Hat } from "../../../Components/Misc/Hat";
import { APINoAsync } from "../../../modules/__mocks__/API";

jest.mock("../../../modules/API");
jest.mock("../../../Components/APIContext");
jest.mock("../../../Components/Misc/Dot");

describe("Hat", () => {
  const person = APINoAsync.fetchPTList()[0];

  describe("Content", () => {
    it("Invalid ID", () => {
      render(<Hat linkID={-1} />);
      expect(screen.getByText("UNSCHEDULED")).toBeInTheDocument();
    });

    it("displays the correct name", () => {
      render(
        < APIContext >
          <Hat linkID={person.person_id} />
        </ APIContext >
      )

      expect(screen.getByText(`${person.first_name} ${person.last_name}`)).toBeInTheDocument();
    });

    it("is scrolls to it's dot when clicked", () => {
      let mockScroll = jest.fn();
      const prevScroll = window.HTMLElement.prototype.scrollIntoView;
      window.HTMLElement.prototype.scrollIntoView = mockScroll;
      const r = render(
        < APIContext >
          < Dot linkID={person.person_id} isScheduled />
          < Hat linkID={person.person_id} />
        </ APIContext >
      );

      const hat = screen.getByTitle(`${person.first_name} ${person.last_name}`);
      hat.click();
      
      expect(mockScroll).toHaveBeenCalled();

      window.HTMLElement.prototype.scrollIntoView = prevScroll;
    });

    it("is flashes name when clicked", async () => {
      let mockScroll = jest.fn();
      const prevScroll = window.HTMLElement.prototype.scrollIntoView;
      window.HTMLElement.prototype.scrollIntoView = mockScroll;
      render(
        < APIContext >
          < Dot linkID={person.person_id} isScheduled />
          < Hat linkID={person.person_id} />
        </ APIContext >
      );

      const hat = screen.getByTitle(`${person.first_name} ${person.last_name}`);
      hat.click();

      for (let t = 0; t < 2000; t += 250) {
        if (t % 500 !== 0) {
          await waitFor(() => {
            expect(screen.getByTestId("Dot").parentElement?.parentElement?.classList).toContain("flash-on"), { timeout: 501 }
          });
        } else {
          await waitFor(() => {
            expect(screen.getByTestId("Dot").parentElement?.parentElement?.classList).not.toContain("flash-on"), { timeout: 501 }
          });
        }
      }

      await waitFor(() => {
        expect(screen.getByTestId("Dot").parentElement?.parentElement?.classList).not.toContain("flash-on");
      });

      window.HTMLElement.prototype.scrollIntoView = prevScroll;
    });
  });

  it("doesn't panic if there are no dots", () => {
    let mockScroll = jest.fn();
      const prevScroll = window.HTMLElement.prototype.scrollIntoView;
      window.HTMLElement.prototype.scrollIntoView = mockScroll;
      render(
        < APIContext >
          < Hat linkID={person.person_id} />
        </ APIContext >
      );

      const hat = screen.getByTitle(`${person.first_name} ${person.last_name}`);
      hat.click();

      expect(mockScroll).not.toHaveBeenCalled();

      window.HTMLElement.prototype.scrollIntoView = prevScroll;
  })
});
