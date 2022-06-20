import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signoutUserRouter } from './routes/signout';
import { signinUserRouter } from './routes/signin';
import { signupUserRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.use(cors());
app.use(express.json());

app.use(currentUserRouter);
app.use(signupUserRouter);
app.use(signoutUserRouter);
app.use(signinUserRouter);

app.all('*', () => {throw new NotFoundError()});

app.use(errorHandler);

const launch = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    app.listen(3000, () => console.log('run!!!'));
  } catch (err) {
    console.error(err)
  }
}

launch();


