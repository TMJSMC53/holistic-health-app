import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '../mocks/node';
import Habits from '../client/src/pages/Habits/Habits';
import { HabitData } from '../client/src/habits';
import { UserState } from '../client/src/main.d';

beforeEach(() => {
	// TODO - Temporary to silence the MSW warning; can remove once tech-debt of fetching within component is removed
	server.use(
		http.get('/api/habits', () => HttpResponse.json([]))
	)
})


describe('Habits', () => {
	const renderWithHabits = (habits: HabitData[] = []) => render(
		<MemoryRouter>
			<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={habits} setHabits={vi.fn()} />
		</MemoryRouter>
	);

	it('should render without errors', () =>
		renderWithHabits()
	);

	describe('authentication', () => {
		const renderWithRoutes = (user: UserState) => render(
			<MemoryRouter initialEntries={['/habits']}>
				<Routes>
					<Route path="/" element={'Homepage'} />
					<Route path="/habits" element={'Habits Page'} />
				</Routes>
				<Habits user={user} habits={[]} setHabits={vi.fn()} />
			</MemoryRouter>
		);

		it('should redirect user to homepage if they are not authenticated', async () => {
			renderWithRoutes(null)
			expect(screen.queryByText('Homepage')).toBeInTheDocument()
		})

		it('should keep user where they are if they are authenticated', async () => {
			renderWithRoutes({ firstName: 'First', lastName: 'Last', username: 'first-last' })
			expect(screen.queryByText('Habits Page')).toBeInTheDocument()
		})
	})

	// or order
	describe('sorting', () => {
		const getSortByDropdownButton = () => screen.getByLabelText('Sort By')
		const waitForLoadingToFinish = () => waitFor(() => expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument())

		const UNSORTED_TEXT = 'Unsorted';
		const BY_NEWEST_ENACT_TEXT = 'By Newest Enact';
		const BY_OLDEST_ENACT_TEXT = 'By Oldest Enact';

		function isTheSelectedSortingOption(textOfShouldBeActive: string) {
			expect(within(screen.getByText(textOfShouldBeActive)).getByRole('img')).toBeInTheDocument()
			const otherTexts = [UNSORTED_TEXT, BY_NEWEST_ENACT_TEXT, BY_OLDEST_ENACT_TEXT].filter(text => text !== textOfShouldBeActive)
			for (const otherText of otherTexts) {
				expect(within(screen.getByText(otherText)).queryByRole('img')).not.toBeInTheDocument()
			}
		}

		describe('dropdown', () => {
			it('should open when button is clicked', async () => {
				// GIVEN the dropdown button is on the screen
				renderWithHabits([]);
				await waitForLoadingToFinish()

				// WHEN it is clicked
				await userEvent.click(getSortByDropdownButton())

				// THEN the contents are visible
				await waitFor(() => {
					expect(screen.queryByText(BY_NEWEST_ENACT_TEXT)).toBeVisible()
				})
			});

			it('should close when button is clicked while it is open', async () => {
				// GIVEN the dropdown is open
				renderWithHabits([]);
				await waitForLoadingToFinish()
				await userEvent.click(getSortByDropdownButton())

				// WHEN the dropdown button is clicked
				await userEvent.click(getSortByDropdownButton())

				// THEN the contents are no longer visible
				await waitFor(() => {
					expect(screen.queryByText(UNSORTED_TEXT)).not.toBeVisible()
				})
			});

			it('should close when option is selected while it is open', async () => {
				// GIVEN the dropdown is open
				renderWithHabits([]);
				await waitForLoadingToFinish()
				await userEvent.click(getSortByDropdownButton())

				// WHEN an option within is clicked
				await userEvent.click(screen.getByText(UNSORTED_TEXT))

				// THEN the contents are no longer visible
				await waitFor(() => {
					expect(screen.queryByText(UNSORTED_TEXT)).not.toBeVisible()
				})
			});

			it('should close when the user clicks outside', async () => {
				// GIVEN the dropdown is open
				renderWithHabits([]);
				await waitForLoadingToFinish()
				await userEvent.click(getSortByDropdownButton())

				// WHEN something outside of the dropdown is clicked
				await userEvent.click(screen.getByText('+ Add Habit'));

				// THEN the contents are no longer visible
				await waitFor(() => {
					expect(screen.queryByText(UNSORTED_TEXT)).not.toBeVisible()
				})
			})
		})

		describe('order', () => {
			// habit creation date = date of first enactment
			it('should initially sort by habit creation date ascending', async () => {
				// GIVEN two habits with different creation dates
				const now = new Date();
				const habits: HabitData[] = [
					{
						_id: '0',
						title: 'First Habit',
						enactments: [new Date(now.getTime() - 60000).toISOString()],
					},
					{
						_id: '1',
						title: 'Second Habit',
						enactments: [now.toISOString()],
					},
				]
				renderWithHabits(habits);

				// WHEN the Habits component renders the habits
				await waitForLoadingToFinish()

				// THEN the habits are rendered in the order of their creation date ascending (least to greatest, oldest to newest)
				const firstHabitTitle = screen.getByText('First Habit');
				const secondHabitTitle = screen.getByText('Second Habit');

				expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
					Node.DOCUMENT_POSITION_FOLLOWING,
				);
			})

			it('active sorting option should be the only option checked', async () => {
				renderWithHabits([]);
				// GIVEN the Habits component renders the dropdown
				await waitForLoadingToFinish()

				// WHEN the sorting options are initially viewed
				await userEvent.click(getSortByDropdownButton())
				// THEN the default option of "Unsorted" has the checkbox beside it
				isTheSelectedSortingOption(UNSORTED_TEXT)

				for (const text of [BY_NEWEST_ENACT_TEXT, BY_OLDEST_ENACT_TEXT, UNSORTED_TEXT]) {
					// WHEN the option is selected
					await userEvent.click(screen.getByText(text))
					// AND the dropdown is re-opened
					await userEvent.click(getSortByDropdownButton())

					// THEN the option has the checkbox beside it
					isTheSelectedSortingOption(text)
				}
			})

			it('should sort from newest enacted to oldest enacted when Newest Enact is selected', async () => {
				// GIVEN two habits with different last enactment dates
				const now = new Date();
				const habits: HabitData[] = [
					{
						_id: '0',
						title: 'Oldest Enacted',
						enactments: [now.toISOString(), new Date(now.getTime() - 60000).toISOString()],
					},
					{
						_id: '1',
						title: 'Newest Enacted',
						enactments: [now.toISOString(), new Date(now.getTime() - 30000).toISOString()],
					},
				]
				renderWithHabits(habits);

				// GIVEN the Habits component renders the habits
				await waitForLoadingToFinish()

				// WHEN the user changes the sort order to Newest Enact
				await userEvent.click(getSortByDropdownButton())
				await userEvent.click(screen.getByText(BY_NEWEST_ENACT_TEXT))

				// THEN the habits are rendered in the order of their most recent enactment, from newest to oldest (descending, largest to smallest)
				const firstHabitTitle = screen.getByText('Newest Enacted');
				const secondHabitTitle = screen.getByText('Oldest Enacted');

				await waitFor(() => {
					expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
						Node.DOCUMENT_POSITION_FOLLOWING,
					);
				});
			})

			it('should sort from oldest enacted to newest enacted when Oldest Enact is selected', async () => {
				// GIVEN two habits with different last enactment dates
				const now = new Date();
				const habits: HabitData[] = [
					{
						_id: '0',
						title: 'Oldest Enacted',
						enactments: [now.toISOString(), new Date(now.getTime() - 60000).toISOString()],
					},
					{
						_id: '1',
						title: 'Newest Enacted',
						enactments: [now.toISOString(), new Date(now.getTime() - 30000).toISOString()],
					},
				]

				renderWithHabits(habits);

				// GIVEN the Habits component renders the habits
				await waitForLoadingToFinish()

				// WHEN the user changes the sort order to Oldest Enact
				await userEvent.click(getSortByDropdownButton())
				await userEvent.click(screen.getByText(BY_OLDEST_ENACT_TEXT))

				// THEN the habits are rendered in the order of their most recent enactment, from oldest to newest (ascending, smallest to largest)
				const firstHabitTitle = screen.getByText('Oldest Enacted');
				const secondHabitTitle = screen.getByText('Newest Enacted');

				await waitFor(() => {
					expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
						Node.DOCUMENT_POSITION_FOLLOWING,
					);
				});
			})

			it('should sort by habit creation date ascending when Unsorted is selected', async () => {
				// GIVEN two habits with different last enactment dates
				const now = new Date();
				const habits: HabitData[] = [
					{
						_id: '0',
						title: 'Oldest Enacted',
						enactments: [new Date(now.getTime() - 90000).toISOString(), new Date(now.getTime() - 60000).toISOString()],
					},
					{
						_id: '1',
						title: 'Newest Enacted',
						enactments: [now.toISOString(), new Date(now.getTime() - 30000).toISOString()],
					},
				]

				renderWithHabits(habits);

				// GIVEN the Habits component renders the habits
				await waitForLoadingToFinish()

				// WHEN the user changes the sort order to Newest Enact
				await userEvent.click(getSortByDropdownButton())
				await userEvent.click(screen.getByText(BY_NEWEST_ENACT_TEXT))

				// THEN the habits are rendered in the order of their most recent enactment, from newest to oldest (descending, largest to smallest)
				let firstHabitTitle = screen.getByText('Newest Enacted');
				let secondHabitTitle = screen.getByText('Oldest Enacted');

				await waitFor(() => {
					expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
						Node.DOCUMENT_POSITION_FOLLOWING,
					);
				});

				// WHEN the user changes the sort order to Unsorted
				await userEvent.click(getSortByDropdownButton())
				await userEvent.click(screen.getByText(UNSORTED_TEXT))

				// THEN the habits are rendered in the order of their creation date ascending (least to greatest, oldest to newest)
				firstHabitTitle = screen.getByText('Oldest Enacted');
				secondHabitTitle = screen.getByText('Newest Enacted');

				await waitFor(() => {
					expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
						Node.DOCUMENT_POSITION_FOLLOWING,
					);
				});
			})
		})

		describe('sorting by & direction storage', () => {
			function givenLocalStorageContaining(getItemReturnValue: unknown) {
				const localStorageMock = {
					getItem: vi.fn().mockReturnValue(getItemReturnValue),
					setItem: vi.fn(),
				};
				Object.defineProperty(global, 'localStorage', {
					value: localStorageMock,
					configurable: true,
				});
				return localStorage.setItem
			}

			it('should store in local storage', async () => {
				const setItem = givenLocalStorageContaining(null);
				renderWithHabits([]);
				await waitForLoadingToFinish()

				// WHEN an option to sort is chosen
				await userEvent.click(getSortByDropdownButton())
				await userEvent.click(screen.getByText(BY_NEWEST_ENACT_TEXT))

				// THEN it is saved into local storage
				expect(setItem).toHaveBeenCalledWith('habits-sorting-by-and-direction', JSON.stringify({ by: 'LATEST_ENACTMENT', direction: 'DESC' }));
			})

			it('should restore from local storage', async () => {
				// GIVEN local storage contains a sorting by & direction
				givenLocalStorageContaining(JSON.stringify({ by: 'LATEST_ENACTMENT', direction: 'ASC' }));

				// WHEN the component is mounted
				renderWithHabits([]);
				await waitForLoadingToFinish()

				// THEN it uses that sorting by & direction
				await userEvent.click(getSortByDropdownButton())
				isTheSelectedSortingOption(BY_OLDEST_ENACT_TEXT)
			})
		})
	})
});