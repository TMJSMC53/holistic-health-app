import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Docs from '../client/src/pages/Docs/Docs';
import '@testing-library/jest-dom';

describe('Docs', () => {
  it('should render the Feedback and Bug Reporting heading ', () => {
    render(<Docs />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('should take the user to the issues page in github', async () => {
    render(<Docs />);

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
