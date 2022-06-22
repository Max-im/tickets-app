import mongoose from 'mongoose';
import { app } from './app';

const launch = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/tickets');
    app.listen(3000, () => console.log('tickets service run'));
  } catch (err) {
    console.error(err)
  }
}

launch();


