import mongoose from 'mongoose';

const DailyQuoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // '2024-12-21' -> Reminder that this is what it looks like in application tab for localStorage
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model('DailyQuote', DailyQuoteSchema);
