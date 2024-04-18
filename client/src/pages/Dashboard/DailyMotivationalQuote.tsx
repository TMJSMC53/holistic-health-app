import { useEffect, useState } from 'react';

export interface Quote {
  quote: string;
  author: string;
}

const DailyMotivationalQuote = () => {
  const [quoteData, setQuoteData] = useState<Quote | null>(null);

  useEffect(() => {
    const getQuoteData = async () => {
      try {
        const response = await fetch(
          `https://corsproxy.io/?${encodeURIComponent(
            'https://zenquotes.io/api/today'
          )}`
        );
        const data = await response.json();
        setQuoteData({
          quote: data[0].q,
          author: data[0].a,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    getQuoteData();
  }, []);
  return (
    <div>
      {quoteData && (
        <div className="m-4 p-1 relative">
          <span className="block text-black py-2 bg-white relative z-10 text-12 italic">
            "{quoteData.quote}" ~{quoteData.author}
          </span>
          <div className="absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-400  to-primary-700" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-700" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyMotivationalQuote;
