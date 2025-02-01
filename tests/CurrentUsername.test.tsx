import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import CurrentUsername from '../client/src/pages/Dashboard/CurrentUsername';

const renderCurrentUsername = (firstName: string) => {
  render(
    <MemoryRouter>
      <CurrentUsername firstName={firstName} />
    </MemoryRouter>
  );
};
describe('CurrentUsername', () => {
  it('should render the welcome message with the user first name on the page', () => {
    // WHEN the user is on the Dashboard page
    renderCurrentUsername('Triola');

    // THEN the user sees a welcome message with the users first name
    const welcomeMessage = screen.getByText('Welcome Back, Triola');

    expect(welcomeMessage).toBeInTheDocument();
  });

  it('should render the back button component', () => {
    renderCurrentUsername('Triola');

    //WHEN the user is in mobile view
    const backButton = screen.getByRole('button');
    expect(backButton).toBeInTheDocument();
  });
});
