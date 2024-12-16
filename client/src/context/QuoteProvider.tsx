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
    const fetchQuote = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedQuote = localStorage.getItem(today);

      if (storedQuote) {
        // Use the stored quote
        setQuoteData(JSON.parse(storedQuote));
      } else {
        try {
          // Fetch a new quote
          const response = await fetch(`/api/daily-quotes`);
          const data = await response.json();
          const newQuote = { quote: data.quote, author: data.author };

          // Save the new quote in localStorage
          localStorage.setItem(today, JSON.stringify(newQuote));
          setQuoteData(newQuote);
        } catch (err) {
          console.error('Error fetching daily quote:', err);
        }
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
