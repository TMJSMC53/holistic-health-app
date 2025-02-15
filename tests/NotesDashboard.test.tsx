import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotesDashboard from '../client/src/pages/Dashboard/NotesDashboard';
import '@testing-library/jest-dom';

describe('NotesDashboard', () => {
  it('should render the Notes heading', () => {
    // GIVEN the user is on the NotesDashboard page
    render(
      <MemoryRouter>
        <NotesDashboard />
      </MemoryRouter>
    );

    // WHEN the user is on the NotesDashboard page
    const h6 = screen.getByRole('heading', {
      level: 6,
      name: 'Notes',
    });
    // THEN the user sees the Notes heading
    expect(h6).toBeInTheDocument();
  });
});
