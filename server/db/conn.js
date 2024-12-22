import mongoose from 'mongoose';

export default async function connect() {
  const connectionString = process.env.ATLAS_URI || '';

  // When testing, use a lower timer for faster failing tests, otherwise use the default 30s
  const timeoutMS = process.env.NODE_ENV === 'test' ? 100 : 30000;
  return mongoose.connect(connectionString, {
    connectTimeoutMS: timeoutMS,
    socketTimeoutMS: timeoutMS,
    serverSelectionTimeoutMS: timeoutMS,
  });
}
