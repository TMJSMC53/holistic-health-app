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

// Set up the request handler before all tests
beforeEach(() => {
  server.use(
    http.put('/api/habits/:habitId', async () => {
      return HttpResponse.json({
        ...mockHabit,
        title: 'Test Title',
        enactments: [...mockHabit.enactments, new Date().toISOString()],
      });
    })
  );
});

const openTheModal = async () => {
  const editIconButton = screen.getByRole('button', {
    name: /edit habit icon/i,
  });
  await userEvent.click(editIconButton);
};
describe('HabitUpdateForm', () => {
  it('should render the HabitUpdateForm component without errors', async () => {
    render(
      <MemoryRouter>
        <HabitUpdateForm habit={mockHabit} isOnHabitPage={true} />
      </MemoryRouter>
    );
  });
  it('should show the Update habit title text', async () => {
    //GIVEN there is a habit to update
    render(
      <MemoryRouter>
        <HabitUpdateForm habit={mockHabit} isOnHabitPage={true} />
      </MemoryRouter>
    );
    //WHEN the modal is open
    await openTheModal();
    // THEN the user sees the Update your habit title text
    const label = screen.getByText('Update your habit title');
    expect(label).toBeInTheDocument();
  });
  it('should show the Title and the current habit title in the input', async () => {
    const testHabit = {
      _id: '12345',
      title: 'Old Title',
      enactments: ['2024-12-27T10:00:00Z'],
    };
    // GIVEN the backend server is listening for habit update requests

    // server.use(
    //   http.put('/api/habits/:habitId', async () => {
    //     return HttpResponse.json({
    //       ...testHabit,
    //       title: 'Test Title',
    //       enactments: [
    //         // include any existing enactments
    //         ...testHabit.enactments,
    //         // add a new enactment
    //         new Date().toISOString(),
    //       ],
    //     });
    //   })
    // );
    //GIVEN there is a habit to update
    render(
      <MemoryRouter>
        <HabitUpdateForm habit={testHabit} isOnHabitPage={true} />
      </MemoryRouter>
    );
    //WHEN the modal is open
    await openTheModal();

    // THEN the user sees the input title
    const title = screen.getByText('Title');
    expect(title).toBeInTheDocument();

    // The input should initially show the old title
    const currentHabitTitle = screen.getByDisplayValue('Old Title');
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
    render(
      <MemoryRouter>
        <HabitUpdateForm habit={mockHabit} isOnHabitPage={true} />
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
