import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  note: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    enum: ['primary-400', 'primary-700', 'accents-400'],
    default: 'primary-400',
  },
  tag: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Note', NoteSchema);
