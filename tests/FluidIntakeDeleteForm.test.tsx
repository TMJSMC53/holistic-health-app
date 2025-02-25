import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import FluidIntakeDeleteForm from '../client/src/pages/Fluids/FluidIntakeDeleteForm';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/node';

const mockFluid = {
  _id: '12345',
  fluidType: 'Test Fluid',
  amount: 330,
  date: '2025-02-15',
};
const openTheModal = async () => {
  const deleteIconButton = screen.getByRole('button', {
    name: /delete fluid icon/i,
  });
  await userEvent.click(deleteIconButton);
};

describe('FluidIntakeDeleteForm', () => {
  it('should render the FluidIntakeDeleteForm component without errors', async () => {
    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );
  });
  it('should call DELETE method with relevant userID', async () => {
    // GIVEN the backend server is listening for fluid deletion requests
    let deleteCalled = false;
    server.use(
      http.delete(`/api/fluidIntakes/${mockFluid._id}`, () => {
        deleteCalled = true;
        return HttpResponse.json({});
      })
    );
    // GIVEN there is a fluid to be deleted

    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    // GIVEN the modal is opened
    await openTheModal();

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
  it('should open and close the confirmation modal', async () => {
    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    // WHEN the modal is closed initially
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // WHEN Open the modal via "Delete Fluid" icon button
    await openTheModal();
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
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );
    const deleteButton = screen.getByRole('button', {
      name: /delete fluid/i,
    });
    // WHEN the modal is open
    await userEvent.click(deleteButton);

    const confirmationMessage = screen.getByText(
      'Are you sure you want to delete this?'
    );
    // THEN the confirmation message is shown on the screen
    expect(confirmationMessage).toBeInTheDocument();
  });
  it('should show error message if user tries to delete a habit that has already been deleted', async () => {
    // GIVEN the backend returns a 404 error

    server.use(
      http.delete(`/api/fluidIntakes/${mockFluid._id}`, () => {
        return HttpResponse.json(
          { message: 'Fluid has already been deleted' },
          { status: 404 }
        );
      })
    );

    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    await openTheModal();

    // AND the delete button is clicked
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteButton);

    // THEN the error message is shown
    const errorMessage = await screen.findByText(
      /Fluid has already been deleted/i
    );
    expect(errorMessage).toBeInTheDocument();

    // AND the modal should still be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should show error message if the server is down', async () => {
    // GIVEN the backend returns a  error

    server.use(
      http.delete(`/api/fluidIntakes/${mockFluid._id}`, () => {
        throw new Error('Network Error');
      })
    );

    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    await openTheModal();

    // AND the delete button is clicked
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteButton);

    // THEN the error message is shown
    const errorMessage = await screen.findByText(
      /Could not connect to server/i
    );
    expect(errorMessage).toBeInTheDocument();

    // AND the modal should still be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should render a 404', async () => {
    server.use(
      http.delete(`/api/fluidIntakes/${mockFluid._id}`, () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    await openTheModal();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText('Fluid has already been deleted')
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('should close the modal when Close button in backdrop is clicked', async () => {
    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    await openTheModal();

    // verify the modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // WHEN the user clicks outside of the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // THEN the modal is closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

describe('Back Button Functionality', () => {
  it('should close the modal when the back button is clicked', async () => {
    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    // open the modal
    await openTheModal();

    // verify the modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // simulate browser back button click
    window.dispatchEvent(new PopStateEvent('popstate'));

    // verify modal is closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should clear error state when modal is closed via back button', async () => {
    server.use(
      http.delete(`/api/fluidIntakes/${mockFluid._id}`, () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    render(
      <MemoryRouter>
        <FluidIntakeDeleteForm fluid={mockFluid} />
      </MemoryRouter>
    );

    await openTheModal();

    // Trigger error state
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(deleteButton);

    // Verify error is shown
    expect(
      await screen.findByText('Fluid has already been deleted')
    ).toBeInTheDocument();

    // Simulate back button
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Verify modal and error are gone
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Fluid has already been deleted')
      ).not.toBeInTheDocument();
    });
  });
});
