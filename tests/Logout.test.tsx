import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Logout from '../client/src/components/Logout';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '../mocks/node';
beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
beforeEach(() => {
  server.resetHandlers();
});

describe('Logout', () => {
  const setUser = () => {};
  it('should render without errors', () => {
    render(
      <MemoryRouter>
        <Logout setUser={setUser} />
      </MemoryRouter>
    );
  });
  it('should request a logout, set the setUser to null, and navigate back to the homepage when the button is clicked ', async () => {
    // GIVEN the server responds to a POST request to /logout
    let logoutCalled = false;
    server.use(
      http.post('/logout', () => {
        logoutCalled = true;
        return HttpResponse.json({});
      })
    );
    // GIVEN a setUser mock function
    const mockSetUser = vi.fn();
    // GIVEN the user is on the /wherever page and there is a homepage with the text of Homepage
    render(
      <MemoryRouter initialEntries={['/wherever']}>
        <Routes>
          <Route path="/" element={'Homepage'} />
          <Route path="/wherever" element={'Wherever'} />
        </Routes>
        <Logout setUser={mockSetUser} />
      </MemoryRouter>
    );

    // WHEN the button is clicked
    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    // THEN the user is set to null
    await waitFor(() => expect(mockSetUser).toHaveBeenCalledWith(null));
    // THEN a POST request to /logout is made
    expect(logoutCalled).toBeTruthy();
    // THEN the user is navigated to the Homepage
    expect(screen.queryByText('Homepage')).not.toBeNull();
  });
});
