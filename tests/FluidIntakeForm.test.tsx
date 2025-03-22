import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import FluidIntakeForm from '../client/src/pages/Fluids/FluidIntakeForm';

import { http, HttpResponse } from 'msw';
import { server } from '../mocks/node';

import { afterAll, beforeAll, vi } from 'vitest';
import { K } from 'vitest/dist/chunks/reporters.C_zwCd4j.js';

describe('FluidIntakeForm', () => {
  it('should render the FluidIntakeForm component without errors', async () => {
    render(
      <MemoryRouter>
        <FluidIntakeForm />
      </MemoryRouter>
    );
  });
  it('should select a fluid type from the datalist', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FluidIntakeForm />
      </MemoryRouter>
    );

    // // WHEN the user clicks on the datalist
    // const fluidTypeInput = screen.getByTestId('fluid-type-input');
    // // THEN the sees the Water option
    // await user.type(fluidTypeInput, 'Water');
    // expect(fluidTypeInput).toHaveValue('Water');
  });
  it('should allow user to write a fluid type in the input field', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FluidIntakeForm />
      </MemoryRouter>
    );

    // WHEN the user clicks on the datalist
    const fluidTypeInput = screen.getByTestId('fluid-type-input');
    // THEN the sees the Water option
    await user.type(fluidTypeInput, 'Water');
    expect(fluidTypeInput).toHaveValue('Water');
  });

  it('should update fluid amount when user enters a value', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FluidIntakeForm />
      </MemoryRouter>
    );

    // WHEN the user goes to enter a fluid amount
    const amountInput = screen.getByPlaceholderText('Amount');
    // THEN the sees the Water option
    await user.type(amountInput, '330');
    expect(amountInput).toHaveValue(330);
  });

  it('should call POST method with the user data', async () => {
    let userInput = {
      fluidType: '',
      amount: 0,
    };
    // GIVEN the server responds to a POST request to /api/fluidIntakes
    const user = userEvent.setup();
    let submitBtnCalled = false;
    server.use(
      http.post(`/api/fluidIntakes`, async (context) => {
        // @ts-ignore
        userInput = await context.request.json();
        submitBtnCalled = true;
        return HttpResponse.json({});
      })
    );

    render(
      <MemoryRouter>
        <FluidIntakeForm />
      </MemoryRouter>
    );

    // Find and interact with form elements
    const fluidTypeInput = screen.getByTestId('fluid-type-input');
    const amountInput = screen.getByPlaceholderText('Amount');

    // Fill out the form
    await user.type(fluidTypeInput, 'Water');
    await user.type(amountInput, '330');

    // WHEN Submit the form
    const submitButton = screen.getByRole('button', { name: /Enter Amount/i });
    await user.click(submitButton);

    // THEN the POST method shows the current user data
    expect(submitBtnCalled).toBeTruthy();
    expect(userInput).toStrictEqual({ fluidType: 'Water', amount: '330' });
  });
});

describe('FluidIntakeForm on window.location.reload', () => {
  // Mock fetch
  beforeEach(() => {
    global.fetch = vi.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        }) as Promise<Response>
    );
  });

  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        reload: vi.fn(),
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('should reload page after form submission', async () => {
    const user = userEvent.setup();

    render(<FluidIntakeForm />);

    // Fill in the form fields
    const fluidTypeInput = screen.getByTestId('fluid-type-input');
    await user.type(fluidTypeInput, 'Water');

    const amountInput = screen.getByPlaceholderText('Amount');
    await user.type(amountInput, '500');

    // Submit the form by clicking the submit button
    const submitButton = screen.getByRole('button', { name: /Enter Amount/i });
    await user.click(submitButton);

    // Wait for the fetch to complete and window.location.reload to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/fluidIntakes',
        expect.any(Object)
      );
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
