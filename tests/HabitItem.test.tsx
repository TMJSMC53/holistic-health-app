import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HabitItem from '../client/src/pages/Habits/HabitItem';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/node';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';

export const mockHabit = {
  _id: '12345',
  title: 'Test Habit',
  enactments: ['2024-12-27T10:00:00Z'],
};

const mockUpdateHabitTitle = vi.fn();

describe('HabitItem', () => {
  it('should show the streak of 1 when the user creates a habit ', () => {
    const mockSetHabit = vi.fn();
    // GIVEN the user created enactment
    const mockHabitWithStreak = {
      _id: '12345',
      title: 'Test Habit',
      enactments: [new Date().toISOString()],
    };
    // WHEN the component renders
    render(
      <MemoryRouter>
        <HabitItem
          habit={mockHabitWithStreak}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );
    // THEN the streak should be 1
    expect(screen.getByText(/Current streak: 1/)).toBeInTheDocument();
  });
  it('should update the streak by 1 when the user records an enactments 2 consecutive days ', () => {
    const mockSetHabit = vi.fn();
    // GIVEN the users enactments are recorded one day apart
    const now = new Date();
    console.log('NOW', now);
    const mockHabitWithStreakOf2 = {
      _id: '12345',
      title: 'Test Habit',
      enactments: [
        new Date(now.getTime() - 86400000).toISOString(),
        now.toISOString(),
      ],
    };
    // WHEN the component renders
    render(
      <MemoryRouter>
        <HabitItem
          habit={mockHabitWithStreakOf2}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );
    // THEN the streak should be 2
    expect(screen.getByText(/Current streak: 2/)).toBeInTheDocument();
  });
  it('should render the HabitItem component without errors', async () => {
    const mockSetHabit = vi.fn();
    render(
      <MemoryRouter>
        <HabitItem
          habit={mockHabit}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Habit')).toBeInTheDocument();
    expect(screen.getByText(/Current streak: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Last recorded:/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Record Test Habit/i })
    ).toBeInTheDocument();
  });
  it('should show an error message when the tries to record another enactment in the same day', async () => {
    // GIVEN there is an enactment already recorded in the day
    const recordedHabit = {
      _id: '12345',
      title: 'Test Habit',
      enactments: [new Date().toISOString()],
    };
    const mockSetHabit = vi.fn();
    // GIVEN the server responds with status code of 400, message, habit
    server.use(
      http.post('/api/habits/:habitId/enactments', async () => {
        return HttpResponse.json(
          { message: 'Habit already recorded for today', habit: recordedHabit },
          { status: 400 }
        );
      })
    );

    // GIVEN the component renders
    render(
      <MemoryRouter>
        <HabitItem
          habit={recordedHabit}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    // WHEN the user clicks on the record enactment button a second time in the same day
    const recordEnactmentBtn = screen.getByText('Record Test Habit');
    await userEvent.click(recordEnactmentBtn);

    // THEN the user receives on error message 'Habit already recorded for today'
    expect(
      screen.getByText('Habit already recorded for today')
    ).toBeInTheDocument();
  });
  it('should handle recording a habit correctly', async () => {
    const mockSetHabit = vi.fn();
    server.use(
      http.post('/api/habits/:habitId/enactments', async () => {
        return HttpResponse.json({
          ...mockHabit,
          enactments: [
            // include any existing enactments
            '2024-12-27T10:00:00Z',
            // add a new enactment
            new Date().toISOString(),
          ],
        });
      })
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HabitItem
          habit={mockHabit}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    const recordButton = screen.getByRole('button', {
      name: /Record Test Habit/i,
    });
    await user.click(recordButton);

    await waitFor(() => {
      expect(mockSetHabit).toHaveBeenCalled();
    });
  });

  it('should show error message when API call fails', async () => {
    const mockSetHabit = vi.fn();
    server.use(
      http.post('/api/habits/:habitId/enactments', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HabitItem
          habit={mockHabit}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    const recordButton = screen.getByRole('button', {
      name: /Record Test Habit/i,
    });
    await user.click(recordButton);

    waitFor(() => {
      expect(screen.getByText('Failed to record habit')).toBeInTheDocument();
    });
  });

  it('should show the plus one button when habit is recorded today', () => {
    const mockSetHabit = vi.fn();
    const habitWithTodayEnactment = {
      ...mockHabit,
      enactments: [new Date().toISOString()],
    };

    render(
      <MemoryRouter>
        <HabitItem
          habit={habitWithTodayEnactment}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: '+ 1' })).toBeInTheDocument();
  });

  it('should handle plus one functionality correctly', async () => {
    server.use(
      http.post('/api/habits/:habitId/enactments/plusOne', async () => {
        return HttpResponse.json({
          _id: '12345',
          title: 'Test Habit',
          enactments: ['2024-12-27T10:00:00Z', new Date().toISOString()],
        });
      })
    );
    const mockSetHabit = vi.fn();
    const user = userEvent.setup();

    const habitWithTodayEnactment = {
      ...mockHabit,
      enactments: [new Date().toISOString()],
    };

    render(
      <MemoryRouter>
        <HabitItem
          habit={habitWithTodayEnactment}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    const plusOneButton = screen.getByRole('button', { name: '+ 1' });

    await user.click(plusOneButton);

    await waitFor(() => {
      expect(mockSetHabit).toHaveBeenCalled();
    });
  });

  it('should go to the individual habit page when you click on the View History link', async () => {
    const mockSetHabit = vi.fn();
    // GIVEN the user is on the /habits page and there is a view history link that links to the /habit/habit._id page

    render(
      <MemoryRouter initialEntries={['/wherever']}>
        <Routes>
          <Route path="/habit/Test Habit" element={'Habits'} />
          <Route path="/wherever" element={'Wherever'} />
        </Routes>
        <HabitItem
          habit={mockHabit}
          setHabit={mockSetHabit}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    const user = userEvent.setup();
    // WHEN the user clicks on the View History link
    await user.click(link);

    // THEN the user is on the /habit/Test Habit
    expect(screen.queryByText('Habits')).not.toBeNull();
  });
});
