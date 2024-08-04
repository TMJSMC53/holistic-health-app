import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../client/src/pages/About/About';

describe('About', () => {
  it('should render the about information', async () => {
    render(<About />);

    const paragraph = screen.getAllByRole('paragraph');
    expect(paragraph.length > 0).toBeTruthy();
  });
});
