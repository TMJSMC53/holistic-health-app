import { useContext } from 'react';
import { QuoteContext, QuoteContextType } from './QuoteProvider';

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};

export default useQuote;
