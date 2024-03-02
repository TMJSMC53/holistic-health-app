import mongoose from 'mongoose';

export default function connect() {
  const connectionString = process.env.ATLAS_URI || '';
  return mongoose.connect(connectionString);
}
