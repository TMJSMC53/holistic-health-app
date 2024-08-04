import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get(
    `https://corsproxy.io/?${encodeURIComponent(
      'https://zenquotes.io/api/today'
    )}`,
    () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json([
        {
          q: "May you always remember to enjoy the road, especially when it's a hard one.",
          a: 'Kobe Bryant',
        },
      ]);
    }
  ),
];
