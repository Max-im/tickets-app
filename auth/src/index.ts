import mongoose from 'mongoose';
import { app } from './app';

const launch = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    app.listen(3001, () => console.log('auth service run'));
  } catch (err) {
    console.error(err)
  }
}

launch();


