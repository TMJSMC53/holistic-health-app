/* v8 ignore start */
import { http, HttpResponse } from 'msw';

// Mock the API response for '/api/daily-quotes'
export const handlers = [
  http.get('/api/daily-quotes', () => {
    // Mock the response you would get from 'https://zenquotes.io/api/today'
    return HttpResponse.json({
      quote:
        "May you always remember to enjoy the road, especially when it's a hard one.",
      author: 'Kobe Bryant',
    });
  }),
];
