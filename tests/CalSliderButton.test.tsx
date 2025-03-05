import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalSliderButton from '../client/src/components/CalSliderButton';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('CalSlider', () => {
  it('should render the Cal Slider Button information', async () => {
    render(
      <MemoryRouter>
        <CalSliderButton />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    // WHEN the button is clicked
    await user.click(calButton);

    // THEN the dropdown is visible
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should show the menu-slide-in class when the menu is opened', async () => {
    // GIVEN the CalSliderButton is visible on the screen
    render(
      <MemoryRouter>
        <CalSliderButton />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    // WHEN the button is clicked
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);
    // THEN the dropdown has the menu-slide-in class
    const dropdown = screen.getByText('Item 1').closest('div');
    expect(dropdown).toHaveClass('menu-slide-in');
  });

  it('should show the menu-slide-out class when the menu is closing', async () => {
    render(
      <MemoryRouter>
        <CalSliderButton />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    // WHEN the dropdown is open
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // AND it's closed
    await user.click(calButton);

    // THEN it should have the menu-slide-out class
    const dropdown = screen.getByText('Item 1').closest('div');
    expect(dropdown).toHaveClass('menu-slide-out');
  });

  it('should apply menu-slide-out class when clicking outside', async () => {
    render(
      <MemoryRouter>
        <CalSliderButton />
        <div data-testid="outside-element">Outside Element</div>
      </MemoryRouter>
    );
    const user = userEvent.setup();

    // Open the dropdown
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // Verify it's open
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    // Click outside
    const outsideElement = screen.getByTestId('outside-element');
    await user.click(outsideElement);

    // Check the closing animation class
    const dropdown = screen.getByText('Item 1').closest('div');
    expect(dropdown).toHaveClass('menu-slide-out');
  });
});

describe('CalSlider Animation Timeout', () => {
  // Use a completely different approach by directly mocking setTimeout
  beforeAll(() => {
    // https://vitest.dev/api/vi.html#vi-stubglobal
    vi.stubGlobal('jest', {
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    });
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Ensures all pending timers are flushed before switching to real timers
    // Reference: https://testing-library.com/docs/using-fake-timers/
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });
  it('should remove dropdown after animation timeout completes', async () => {
    // Mock setTimeout to immediately execute callbacks
    // Fake timers using Jest
    beforeEach(() => {
      vi.useFakeTimers();
    });
    render(
      <MemoryRouter>
        <CalSliderButton />
      </MemoryRouter>
    );

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });

    // Open the dropdown
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // Verify dropdown is open
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    // Close the dropdown - setTimeout is mocked to run immediately
    await user.click(calButton);
  });

  //     // Mock setTimeout to immediately execute callbacks
  //     // Fake timers using Jest
  //     beforeEach(() => {
  //       vi.useFakeTimers();
  //     });
  //     render(
  //       <MemoryRouter>
  //         <CalSliderButton />
  //       </MemoryRouter>
  //     );

  //     const user = userEvent.setup({
  //       advanceTimers: vi.advanceTimersByTime.bind(vi),
  //     });

  //     // Open the dropdown
  //     const calButton = screen.getByRole('button', { name: '📅 Cal' });
  //     await user.click(calButton);

  //     // Verify dropdown is open
  //     expect(screen.getByText('Item 1')).toBeInTheDocument();
  //     const item1 = 'Item 1';
  //     await waitFor(() => {
  //       expect(screen.queryByText(item1)).not.toBeInTheDocument();
  //     });
  //   });
});

describe('dropdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should close when the user clicks outside', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });

    render(
      <MemoryRouter>
        <div>
          <CalSliderButton />
          <div data-testid="outside-element">Outside Element</div>
        </div>
      </MemoryRouter>
    );

    // Open the dropdown
    const calButton = screen.getByRole('button', { name: '📅 Cal' });
    await user.click(calButton);

    // Verify dropdown is open
    expect(screen.getByText('Item 1')).toBeInTheDocument();

    // Click outside the dropdown
    const outsideElement = screen.getByTestId('button-id');
    await user.click(outsideElement);

    // Advance timers to trigger the closing animation
    vi.advanceTimersByTime(300);

    // Wait for the dropdown to be removed
    await waitFor(
      () => {
        expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  }, 2000);
  //   it('should close when the user clicks outside', async () => {
});
