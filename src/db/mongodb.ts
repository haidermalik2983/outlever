import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose || { 
  conn: null, 
  promise: null,
  isConnected: false
};

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.isConnected) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    cached.isConnected = true;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Connect to MongoDB at startup
connectToDatabase().catch(err => console.error('Failed to connect to MongoDB:', err));

export default connectToDatabase; 