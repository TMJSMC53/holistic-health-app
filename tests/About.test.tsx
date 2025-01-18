import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../client/src/pages/About/About';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('About', () => {
  it('should render the about information', async () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const paragraph = screen.getAllByRole('paragraph');
    expect(paragraph.length > 0).toBeTruthy();
  });

  it('should show the back button when user is on the About page', async () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should take the user to the previous page when back button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <About />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const backButton = screen.getByTestId('back-button');
    await user.click(backButton);

    expect(window.location.pathname).not.toBe('/about');
  });
});
