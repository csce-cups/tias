import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EditButton } from '../../../Components/EmployeeList/EditButton';
import contexts, { APIContext } from '../../../Components/APIContext';

jest.mock('../../../Components/APIContext');
jest.mock('../../../modules/API');

describe('EditButton', () => {    
	let boolSpy = jest.fn();
	let countSpy = jest.fn();
	let editingState: {
		bool: [boolean, jest.Mock],
		count: [number, jest.Mock]
	}

	beforeEach(() => {
		editingState = {
			bool: [false, boolSpy],
			count: [0, countSpy]
		}
	});

	afterEach(() => {
		boolSpy.mockReset();
		countSpy.mockReset();
	});
	
    it("says 'Edit Schedule'", () => {
		render(<EditButton editingState={editingState} />);
		expect(screen.getByText('Edit Schedule')).toBeInTheDocument();
	});

	describe("editing mode", () => {
		describe("fetching data", () => {
			it("loads everyone's viable courses if they are not there already", async () => {
				const fn = jest.fn();
				render(
					< APIContext >
						< contexts.allViableCourses.Consumer >
							{() => (
								< contexts.allViableCourses.Provider value={[new Map(), fn, new Map()]}>
									<EditButton editingState={editingState} />
								</contexts.allViableCourses.Provider>
							)}
						</contexts.allViableCourses.Consumer>
					</APIContext>
				)
	
				const btn = screen.getByRole("button");
				btn.click();
				await waitFor(() => {
					expect(fn).toHaveBeenCalled();
				})
			})
	
			it("doesn't fetch viable courses if they are already there", async () => {
				const fn = jest.fn();
				render(
					< APIContext >
						< contexts.allViableCourses.Consumer >
							{([schedule,_,mapped]) => (
								< contexts.allViableCourses.Provider value={[schedule, fn, mapped]}>
									<EditButton editingState={editingState} />
								</contexts.allViableCourses.Provider>
							)}
						</contexts.allViableCourses.Consumer>
					</APIContext>
				)
	
				const btn = screen.getByRole("button");
				btn.click();
				await waitFor(() => {
					expect(fn).not.toHaveBeenCalled();
				})
			})
		})

		describe("text", () => {
			it("Says 'Stop Editing' when no edits are recorded", async () => {
				editingState.bool[0] = true;
				editingState.count[0] = 0;
				render (
					< APIContext >
						<EditButton editingState={editingState} />
					</APIContext>
				);

				expect(screen.getByText('Stop Editing')).toBeInTheDocument();
			});

			it("Says 'Save ___ edits' when there are edits to save", async () => {
				editingState.bool[0] = true;
				editingState.count[0] = 5;
				render (
					< APIContext >
						<EditButton editingState={editingState} />
					</APIContext>
				);

				expect(screen.getByText(`Save ${editingState.count[0]} changes`)).toBeInTheDocument();
			});
		})

		describe("cancelling", () => {
			beforeEach(() => {
				editingState.bool[0] = true;
				editingState.count[0] = 5;
			})

			it("presents a cancel button when edits have been made", () => {
				render (
					< APIContext >
						<EditButton editingState={editingState} />
					</APIContext>
				);

				expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument();
			})

			it("alerts when pressed", () => {
				const confirm = jest.spyOn(window, "confirm").mockImplementation(() => false);

				render (
					< APIContext >
						<EditButton editingState={editingState} />
					</APIContext>
				);

				const cancelBtn = screen.getByRole("button", {name: "Cancel"});
				cancelBtn.click();
				expect(confirm).toHaveBeenCalled();
			})

			it("resets when pressed", () => {
				const confirm = jest.spyOn(window, "confirm").mockImplementation(() => true);

				render (
					< APIContext >
						<EditButton editingState={editingState} />
					</APIContext>
				);

				const cancelBtn = screen.getByRole("button", {name: "Cancel"});
				cancelBtn.click();
				expect(editingState.bool[0]).toBe(false);
				expect(editingState.count[0]).toBe(0);
			})
		})
	})
});