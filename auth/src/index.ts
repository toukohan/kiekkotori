import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting up auth...');
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB auth');
  } catch (error) {
    console.error(error);
  }
};

app.listen(3000, () => {
  console.log('Service listening on port 3000');
});

start();