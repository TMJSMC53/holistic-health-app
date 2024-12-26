import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HabitDeleteForm from '../client/src/pages/Habit/HabitDeleteForm';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/node';

const mockHabit = {
  _id: '12345',
  title: 'Test Habit',
  enactments: [],
};

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('HabitDeleteForm', () => {
  it('should render the DeleteHabitForm component without errors', async () => {
    render(
      <MemoryRouter>
        <HabitDeleteForm habit={mockHabit} />
      </MemoryRouter>
    );
  });
  it('should call delete method with relevant user ID', async () => {
    // let deleteCalled = false;
    server.use(
      http.delete(`/api/habits/${mockHabit._id}`, () => {
        // deleteCalled = true;
        return HttpResponse.json({});
      })
    );
    render(
      <MemoryRouter>
        <HabitDeleteForm habit={mockHabit} />
      </MemoryRouter>
    );
    const deleteIconButton = screen.getByRole('button', {
      name: /delete habit icon/i,
    });
    userEvent.click(deleteIconButton);

    const deleteButton = screen.getByRole('button', {
      name: /delete/i,
    });
    userEvent.click(deleteButton);
  });

  it('should open and close the confirmation modal ', async () => {
    render(
      <MemoryRouter>
        <HabitDeleteForm habit={mockHabit} />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    // WHEN the modal is closed initially
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Open the modal via "Delete Habit" icon button
    const deleteButton = screen.getByRole('button', {
      name: /delete habit icon/i,
    });
    await user.click(deleteButton);
    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    // Close the modal via "Cancel"
    await user.click(screen.getByText(/cancel/i));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  it('should show confirmation message to user in modal', async () => {
    render(
      <MemoryRouter>
        <HabitDeleteForm habit={mockHabit} />
      </MemoryRouter>
    );
    const deleteButton = screen.getByRole('button', { name: /delete habit/i });
    await userEvent.click(deleteButton);

    // when the modal is open the user sees confirm delete
    const confirmationMessage = screen.getByText(
      'Are you sure you want to delete this?'
    );
    expect(confirmationMessage).toBeInTheDocument();
  });
});
