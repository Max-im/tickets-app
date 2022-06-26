import express from 'express';
import 'express-async-errors';
import coockieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mpozhydaiev-tickets/common';

const app = express();

app.set('trust proxy', true);
app.use(
  coockieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(express.json());

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
