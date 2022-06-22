import mongoose from 'mongoose';
import { app } from './app';

const launch = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(3000, () => console.log('auth service run'));
  } catch (err) {
    console.error(err)
  }
}

launch();


