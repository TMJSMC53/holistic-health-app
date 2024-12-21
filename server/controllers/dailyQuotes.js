import DailyQuote from '../models/dailyQuote.js';

export const getDailyQuote = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  // check and get the quote if it existes for the day
  const storedQuote = await DailyQuote.findOne({
    date: today,
  });

  // if there is a quote, return it
  if (storedQuote) {
    res.status(200).send({
      quote: storedQuote.quote,
      author: storedQuote.author,
    });
    return;
  }

  try {
    const response = await fetch('https://zenquotes.io/api/today');

    // if zenquotes is down, we will get this error message
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }

    // This allows us to get the quote and author from zenquotes
    const data = await response.json();

    const newQuote = new DailyQuote({
      quote: data[0].q,
      author: data[0].a,
      date: today,
    });
    // this is the caching of the quote
    await newQuote.save();

    // this let's us know that it was successfully created and cached (stored)
    res.status(201).json(newQuote);
  } catch (error) {
    console.error('Error fetching the daily quote:', error);
    res.status(500).json({ error: 'Failed to fetch daily quote' });
  }
};
