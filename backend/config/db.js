const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const options = {
      maxPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    console.log(`✓ Pool size: ${options.maxPoolSize}`);

    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected');
    });

    // Handle reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('✓ MongoDB reconnected');
    });

    // Handle errors
    mongoose.connection.on('error', (err) => {
      console.error('✗ MongoDB error:', err.message);
    });

    return conn;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };

