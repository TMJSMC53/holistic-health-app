import useQuote from '../../context/useQuote';
export interface Quote {
  quote: string;
  author: string;
}

const DailyMotivationalQuote = () => {
  const { quoteData } = useQuote();

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
