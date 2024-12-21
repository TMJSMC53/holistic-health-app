import { createContext, useState, useEffect, ReactNode } from 'react';

interface Quote {
  quote: string;
  author: string;
}

export interface QuoteContextType {
  quoteData: Quote | null;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(
  undefined
);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [quoteData, setQuoteData] = useState<Quote | null>(null);

  useEffect(() => {
    const FALLBACK_QUOTE = {
      quote:
        "May you always remember to enjoy the road, especially when it's a hard one.",
      author: 'Kobe Bryant',
    };

    const fetchQuote = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedQuote = localStorage.getItem(today);

      if (storedQuote) {
        const parsedQuote = JSON.parse(storedQuote);
        if (parsedQuote.quote && parsedQuote.author) {
          setQuoteData(parsedQuote);
          return;
        }
      }

      try {
        const response = await fetch('/api/daily-quotes');
        if (!response.ok) {
          throw new Error(`Failed to fetch quote: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.author === 'zenquotes.io') {
          setQuoteData(FALLBACK_QUOTE);

          setTimeout(() => {
            fetchQuote();
          }, 20000);
          return;
        }
        if (data.quote && data.author) {
          const newQuote = { quote: data.quote, author: data.author };
          localStorage.setItem(today, JSON.stringify(newQuote));
          setQuoteData(newQuote);
        } else {
          throw new Error('Invalid quote data received');
        }
      } catch (err) {
        console.error('Error fetching quote:', err);
        setQuoteData(FALLBACK_QUOTE); // Set fallback quote here
      }
    };

    fetchQuote();
  }, []);

  return (
    <QuoteContext.Provider value={{ quoteData }}>
      {children}
    </QuoteContext.Provider>
  );
};
