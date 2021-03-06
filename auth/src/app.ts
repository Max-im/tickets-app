import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import coockieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@mpozhydaiev-tickets/common';

import { currentUserRouter } from './routes/current-user';
import { signoutUserRouter } from './routes/signout';
import { signinUserRouter } from './routes/signin';
import { signupUserRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true);
app.use(coockieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(cors());
app.use(express.json());

app.use(currentUserRouter);
app.use(signupUserRouter);
app.use(signoutUserRouter);
app.use(signinUserRouter);

app.all('*', () => {throw new NotFoundError()});

app.use(errorHandler);

export {app};


