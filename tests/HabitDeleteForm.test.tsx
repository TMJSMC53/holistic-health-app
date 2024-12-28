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

describe('HabitDeleteForm', () => {
  it('should render the DeleteHabitForm component without errors', async () => {
    render(
      <MemoryRouter>
        <HabitDeleteForm habit={mockHabit} />
      </MemoryRouter>
    );
  });
  it('should call delete method with relevant user ID', async () => {
    // GIVEN the backend server is listening for habit deletion requests
    let deleteCalled = false;
    server.use(
      http.delete(`/api/habits/${mockHabit._id}`, () => {
        deleteCalled = true;
        return HttpResponse.json({});
      })
    );

    // GIVEN there is a habit to be deleted
    render(
      <MemoryRouter>
        <HabitDeleteForm habit={mockHabit} />
      </MemoryRouter>
    );

    // GIVEN the modal is opened
    const deleteIconButton = screen.getByRole('button', {
      name: /delete habit icon/i,
    });
    await userEvent.click(deleteIconButton);

    // WHEN the delete button is clicked
    const deleteButton = screen.getByRole('button', {
      name: 'Delete',
    });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      // THEN the request is made
      expect(deleteCalled).toBe(true);
    });
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

    // WHEN Open the modal via "Delete Habit" icon button
    const deleteButton = screen.getByRole('button', {
      name: /delete habit icon/i,
    });
    await user.click(deleteButton);
    // THEN the modal is open
    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    // WHEN user Closes the modal via "Cancel"
    await user.click(screen.getByText(/cancel/i));
    await waitFor(() => {
      // THEN the modal is closed
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
    // WHEN the modal is open
    await userEvent.click(deleteButton);

    const confirmationMessage = screen.getByText(
      'Are you sure you want to delete this?'
    );
    // THEN the confirmation message is shown on the screen
    expect(confirmationMessage).toBeInTheDocument();
  });
});
