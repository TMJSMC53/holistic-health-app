import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Docs from '../client/src/pages/Docs/Docs';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('Docs', () => {
  //Mock user object

  const mockUser = {
    id: '12345',
    name: 'Test User',
    isAuthenticated: true,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
  };
  it('should render the Feedback and Bug Reporting heading ', () => {
    render(
      <MemoryRouter>
        <Docs user={mockUser} />
      </MemoryRouter>
    );

    const h2 = screen.getByRole('heading', {
      level: 2,
      name: 'Feedback and Bug Reporting',
    });
    expect(h2).toBeInTheDocument();
  });

  it('should take the user to the issues page in github', async () => {
    render(
      <MemoryRouter>
        <Docs user={mockUser} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe(
      'https://github.com/TMJSMC53/holistic-health-app/issues'
    );
    // mock function
    const clickListener = vi.fn();
    link.addEventListener('click', clickListener);

    const user = userEvent.setup();
    await user.click(link);
    expect(clickListener).toHaveBeenCalled();
  });
});
