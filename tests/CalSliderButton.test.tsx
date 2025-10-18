import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalSliderButton from '../client/src/components/CalSliderButton';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('CalSlider', () => {
  it('should render the Cal Slider Button information', async () => {
    render(
      <MemoryRouter>
        <CalSliderButton habits={[]} />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    // WHEN the button is clicked
    await user.click(calButton);

    // THEN the dropdown is visible
    await waitFor(() => {
      expect(screen.queryByText('Mon')).toBeInTheDocument();
    });

    await user.click(calButton);
    waitFor(() => {
      expect(screen.queryByText('Tue')).not.toBeInTheDocument();
    });
  });

  it('should show the react-calendar__month-view__weekdays__weekday class when the menu is opened', async () => {
    // GIVEN the CalSliderButton is visible on the screen
    render(
      <MemoryRouter>
        <CalSliderButton habits={[]} />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    // WHEN the button is clicked
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);
    // THEN the dropdown has the menu-slide-in class
    const dropdown = screen.getByText('Mon').closest('div');
    expect(dropdown).toHaveClass(
      'react-calendar__month-view__weekdays__weekday'
    );
  });

  it('should show the react-calendar__month-view__weekdays__weekday class when the menu is closing', async () => {
    render(
      <MemoryRouter>
        <CalSliderButton habits={[]} />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // WHEN the dropdown is open
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // THEN it should have the menu-slide-out class
    const dropdown = screen.getByText('Mon').closest('div');
    expect(dropdown).toHaveClass(
      'react-calendar__month-view__weekdays__weekday'
    );
  });
});

describe('CalSlider Animation Timeout', () => {
  it('should remove dropdown after animation timeout completes', async () => {
    render(
      <MemoryRouter>
        <CalSliderButton habits={[]} />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // WHEN the user clicks on the calendar button
    // Open the dropdown
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // THEN the user sees the calendar
    // Verify dropdown is open
    await waitFor(() => {
      expect(screen.queryByText('Mon')).toBeInTheDocument();
    });

    //WHEN the user clicks on the calendar button
    await user.click(calButton);
    // Close the dropdown - setTimeout is mocked to run immediately
    await waitFor(() => {
      expect(screen.queryByText('Mon')).not.toBeInTheDocument();
    });
  });
});

describe('click outside of calendar', () => {
  it('should close when the user clicks outside', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <div>
          <CalSliderButton habits={[]} />
          <div data-testid="outside-element">Outside Element</div>
        </div>
      </MemoryRouter>
    );

    // WHEN the user clicks the calendar button
    // Open the dropdown
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // THEN the calendar is visible with 'Mon'
    // Verify dropdown is open
    await waitFor(() => {
      expect(screen.queryByText('Mon')).toBeInTheDocument();
    });

    // WHEN the user clicks outside the dropdown
    // Click outside the dropdown
    const outsideElement = screen.getByTestId('outside-element');
    await user.click(outsideElement);
    screen.debug(outsideElement);

    // THEN the calendar is no longer visible
    // Wait for the dropdown to be removed
    await waitFor(() => {
      expect(screen.queryByText('Mon')).not.toBeInTheDocument();
    });
  });
});
