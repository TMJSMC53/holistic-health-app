import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../client/src/pages/About/About';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
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
    // GIVEN the user is on the previous dashboard page, and then goes to the about page
    render(
      <MemoryRouter initialEntries={['/dashboard', '/about']}>
        <Routes>
          <Route path="/dashboard" element={'Dashboard'} />
          <Route path="/about" element={'About'} />
        </Routes>
        <About />
      </MemoryRouter>
    );
    // WHEN user clicks the back button
    const user = userEvent.setup();
    const backButton = screen.getByText('Back');

    await user.click(backButton);

    // THEN the user is navigated to the Dashboard
    expect(screen.queryByText('Dashboard')).not.toBeNull();
  });
});
