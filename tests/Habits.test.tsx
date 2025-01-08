import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '../mocks/node';
import Habits from '../client/src/pages/Habits/Habits';
import { HabitData } from '../client/src/habits';

beforeEach(() => {
	// TODO - Temporary to silence the MSW warning; can remove once tech-debt of fetching within component is removed
	server.use(
		http.get('/api/habits', () => HttpResponse.json([]))
	)
})

function isTheSelectedSortingOption(textOfShouldBeActive: string){
	expect(within(screen.getByText(textOfShouldBeActive)).getByRole('img')).toBeInTheDocument()
	const otherTexts = ['Unsorted', 'By Newest Enact', 'By Oldest Enact'].filter(text => text !== textOfShouldBeActive)
	for (const otherText of otherTexts){
		expect(within(screen.getByText(otherText)).queryByRole('img')).not.toBeInTheDocument()
	}
}

describe('Habits', () => {
	it('should render without errors', () => {
		render(
			<MemoryRouter>
				<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
			</MemoryRouter>
		);
	});

	// or order
	describe('sorting', () => {
		describe('dropdown', () => {
			it('should open when button is clicked', async () => {
				// GIVEN the dropdown button is on the screen
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
					</MemoryRouter>
				);
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})
				const dropdownButton = screen.getByLabelText('Sort By')

				// WHEN it is clicked
				await userEvent.click(dropdownButton)

				// THEN the contents are visible
				await waitFor(() => {
					expect(screen.queryByText('By Newest Enact')).toBeVisible()
				})
			});

			it('should close when button is clicked while it is open', async () => {
				// GIVEN the dropdown is open
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
					</MemoryRouter>
				);
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})
				await userEvent.click(screen.getByLabelText('Sort By'))

				// WHEN the dropdown button is clicked
				await userEvent.click(screen.getByLabelText('Sort By'))

				// THEN the contents are no longer visible
				await waitFor(() => {
					expect(screen.queryByText('Unsorted')).not.toBeVisible()
				})
			});

			it('should close when option is selected while it is open', async () => {
				// GIVEN the dropdown is open
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
					</MemoryRouter>
				);
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})
				await userEvent.click(screen.getByLabelText('Sort By'))

				// WHEN an option within is clicked
				await userEvent.click(screen.getByText('Unsorted'))
				// THEN the contents are no longer visible
				await waitFor(() => {
					expect(screen.queryByText('Unsorted')).not.toBeVisible()
				})
			});
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

				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={habits} setHabits={vi.fn()} />
					</MemoryRouter>
				);

				// WHEN the Habits component renders the habits
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})


				// THEN the habits are rendered in the order of their creation date ascending (least to greatest, oldest to newest)
				const firstHabitTitle = screen.getByText('First Habit');
				const secondHabitTitle = screen.getByText('Second Habit');

				expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
					Node.DOCUMENT_POSITION_FOLLOWING,
				);
			})

			it('active sorting option should be the only option checked', async () => {
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
					</MemoryRouter>
				);
				// GIVEN the Habits component renders the dropdown
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})

				// WHEN the sorting options are initially viewed
				await userEvent.click(screen.getByLabelText('Sort By'))
				// THEN the default option of "Unsorted" has the checkbox beside it
				isTheSelectedSortingOption('Unsorted')

				// WHEN the "By Newest Enact" option is selected
				await userEvent.click(screen.getByText('By Newest Enact'))
				await userEvent.click(screen.getByLabelText('Sort By'))
				// THEN the option of "By Newest Enact" has the checkbox beside it
				isTheSelectedSortingOption('By Newest Enact')

				// WHEN the "By Oldest Enact" option is selected
				await userEvent.click(screen.getByText('By Oldest Enact'))
				await userEvent.click(screen.getByLabelText('Sort By'))
				// THEN the option of "By Oldest Enact" has the checkbox beside it
				isTheSelectedSortingOption('By Oldest Enact')

				// WHEN the "Unsorted" option is selected
				await userEvent.click(screen.getByText('Unsorted'))
				await userEvent.click(screen.getByLabelText('Sort By'))
				// THEN the option of "Unsorted" has the checkbox beside it
				isTheSelectedSortingOption('Unsorted')
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
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={habits} setHabits={vi.fn()} />
					</MemoryRouter>
				);

				// GIVEN the Habits component renders the habits
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})

				// WHEN the user changes the sort order to Newest Enact
				await userEvent.click(screen.getByLabelText('Sort By'))
				await userEvent.click(screen.getByText('By Newest Enact'))

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

				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={habits} setHabits={vi.fn()} />
					</MemoryRouter>
				);

				// GIVEN the Habits component renders the habits
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})

				// WHEN the user changes the sort order to Oldest Enact
				await userEvent.click(screen.getByLabelText('Sort By'))
				await userEvent.click(screen.getByText('By Oldest Enact'))

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

				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={habits} setHabits={vi.fn()} />
					</MemoryRouter>
				);

				// GIVEN the Habits component renders the habits
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})

				// WHEN the user changes the sort order to Newest Enact
				await userEvent.click(screen.getByLabelText('Sort By'))
				await userEvent.click(screen.getByText('By Newest Enact'))

				// THEN the habits are rendered in the order of their most recent enactment, from newest to oldest (descending, largest to smallest)
				let firstHabitTitle = screen.getByText('Newest Enacted');
				let secondHabitTitle = screen.getByText('Oldest Enacted');

				await waitFor(() => {
					expect(firstHabitTitle.compareDocumentPosition(secondHabitTitle)).toEqual(
						Node.DOCUMENT_POSITION_FOLLOWING,
					);
				});

				// WHEN the user changes the sort order to Unsorted
				await userEvent.click(screen.getByLabelText('Sort By'))
				await userEvent.click(screen.getByText('Unsorted'))

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
			it('should store in local storage', async () => {
				const localStorageMock = {
					getItem: vi.fn().mockReturnValue(null),
					setItem: vi.fn(),
					removeItem: vi.fn(),
					clear: vi.fn(),
				};
				Object.defineProperty(global, 'localStorage', {
					value: localStorageMock,
					configurable: true,
				});
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
					</MemoryRouter>
				);
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})

				// WHEN an option to sort is chosen
				await userEvent.click(screen.getByLabelText('Sort By'))
				await userEvent.click(screen.getByText('By Newest Enact'))

				// THEN it is saved into local storage
				expect(localStorageMock.setItem).toHaveBeenCalledWith('habits-sorting-by-and-direction', JSON.stringify({ by: 'LATEST_ENACTMENT', direction: 'DESC'}));
			})

			it('should restore from local storage', async () => {
				// GIVEN local storage contains a sorting by & direction
				const localStorageMock = {
					getItem: vi.fn().mockReturnValue(JSON.stringify({ by: 'LATEST_ENACTMENT', direction: 'ASC'})),
					setItem: vi.fn(),
					removeItem: vi.fn(),
					clear: vi.fn(),
				};
				Object.defineProperty(global, 'localStorage', {
					value: localStorageMock,
					configurable: true,
				});

				// WHEN the component is mounted
				render(
					<MemoryRouter>
						<Habits user={{ firstName: 'First', lastName: 'Last', username: 'first-last' }} habits={[]} setHabits={vi.fn()} />
					</MemoryRouter>
				);
				await waitFor(() => {
					expect(screen.queryByText('Loading habits...')).not.toBeInTheDocument();
				})

				// THEN it uses that sorting by & direction
				await userEvent.click(screen.getByLabelText('Sort By'))
				isTheSelectedSortingOption('By Oldest Enact')
			})
		})
	})
});