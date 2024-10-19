import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  enactments: [
    {
      type: String,
      default: [],
    },
  ],
});
console.log(HabitSchema);
export default mongoose.model('Habit', HabitSchema);
