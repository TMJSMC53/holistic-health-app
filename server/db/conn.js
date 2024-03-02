import mongoose from 'mongoose';

export default function connect() {
  const connectionString = process.env.ATLAS_URI || '';
  console.log('Connection String', connectionString);
  return mongoose.connect(connectionString);
}
