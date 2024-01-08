import mongoose from 'mongoose';

const fluidIntakeSchema = new mongoose.Schema({
  fluidType: {
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

export default mongoose.model('FluidIntake', fluidIntakeSchema);
