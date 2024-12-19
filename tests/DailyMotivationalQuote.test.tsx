import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyMotivationalQuote from '../client/src/pages/Dashboard/DailyMotivationalQuote';
import { MemoryRouter } from 'react-router-dom';
import { QuoteProvider } from '../client/src/context/QuoteProvider';
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

describe('DailyMotivationalQuote', () => {
  it('should show nothing initially when the page is rendered', () => {
    render(
      <MemoryRouter>
        <QuoteProvider>
          <DailyMotivationalQuote />
        </QuoteProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/~/i)).toBeNull();
  });
  it('should show the quote when the page is rendered', async () => {
    render(
      <MemoryRouter>
        <QuoteProvider>
          <DailyMotivationalQuote />
        </QuoteProvider>
      </MemoryRouter>
    );

    const quoteWrapper = await screen.findByText(/~/i);
    expect(quoteWrapper).not.toBeNull();
    expect(quoteWrapper).toHaveTextContent(
      "May you always remember to enjoy the road, especially when it's a hard one."
    );
    expect(quoteWrapper).toHaveTextContent('Kobe Bryant');
  });
});
