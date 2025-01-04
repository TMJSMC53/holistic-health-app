import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HabitUpdateForm from '../client/src/pages/Habit/HabitUpdateForm';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/node';

const mockHabit = {
  _id: '12345',
  title: 'Test Title',
  enactments: [],
};

const openTheModal = async () => {
  const editIconButton = screen.getByRole('button', {
    name: /edit habit icon/i,
  });
  await userEvent.click(editIconButton);
};
describe('HabitUpdateForm', () => {
  it('should render the HabitUpdateForm component without errors', async () => {
    const mockUpdateHabitTitle = vi.fn();
    render(
      <MemoryRouter>
        <HabitUpdateForm
          habit={mockHabit}
          isOnHabitPage={true}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );
  });
  it('should show the Update habit title text', async () => {
    const mockUpdateHabitTitle = vi.fn();
    //GIVEN there is a habit to update
    render(
      <MemoryRouter>
        <HabitUpdateForm
          habit={mockHabit}
          isOnHabitPage={true}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );
    //WHEN the modal is open
    await openTheModal();
    // THEN the user sees the Update your habit title text
    const label = screen.getByText('Update your habit title');
    expect(label).toBeInTheDocument();
  });
  it('should show the Title and the current habit title in the input', async () => {
    // Set up the request handler
    server.use(
      http.put('/api/habits/:habitId', async () => {
        return HttpResponse.json({
          ...mockHabit,
          title: 'Test Title',
          enactments: [...mockHabit.enactments, new Date().toISOString()],
        });
      })
    );

    const mockUpdateHabitTitle = vi.fn();

    //GIVEN there is a habit to update
    render(
      <MemoryRouter>
        <HabitUpdateForm
          habit={mockHabit}
          isOnHabitPage={true}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );
    //WHEN the modal is open
    await openTheModal();

    // THEN the user sees the input title
    const title = screen.getByText('Title');
    expect(title).toBeInTheDocument();

    // The input should initially show the old title
    const currentHabitTitle = screen.getByDisplayValue('Test Title');
    expect(currentHabitTitle).toBeInTheDocument();

    const editButton = screen.getByRole('button', {
      name: 'Save',
    });

    await userEvent.click(editButton);

    await waitFor(() => {
      const updatedHabitTitle = screen.getByDisplayValue('Test Title');
      expect(updatedHabitTitle).toBeInTheDocument();
    });
  });
  it('should open and close the Update your habit title modal', async () => {
    const mockUpdateHabitTitle = vi.fn();
    render(
      <MemoryRouter>
        <HabitUpdateForm
          habit={mockHabit}
          isOnHabitPage={true}
          updateHabitTitle={mockUpdateHabitTitle}
        />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    // WHEN the modal is closed initially

    // expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const modalElement = screen.getByRole('dialog');
    expect(modalElement).not.toHaveClass('open');

    // WHEN Open the modal via "Edit Habit" icon button
    await openTheModal();

    // THEN the modal is open
    await waitFor(() => {
      expect(modalElement).toHaveClass('open');
    });

    // WHEN user Closes the modal via "Cancel"
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(modalElement).not.toHaveClass('open');
    });
  });
});
