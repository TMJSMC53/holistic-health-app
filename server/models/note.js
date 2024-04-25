import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

console.log(NoteSchema);

export default mongoose.model('Note', NoteSchema);
