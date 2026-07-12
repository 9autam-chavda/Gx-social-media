const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const loadEnv = () => {
  if (!process.env.MONGO_URI) {
    const envPath = path.join(__dirname, '../../.env');
    dotenv.config({ path: envPath });
  }
};

const connectDB = async () => {
  loadEnv();

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(uri);

    console.log('MongoDB Connected ✅');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;