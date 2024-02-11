import mongoose from 'mongoose';

const waterIntakeGoalSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('WaterIntakeGoal', waterIntakeGoalSchema);
