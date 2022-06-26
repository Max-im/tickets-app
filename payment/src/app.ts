import express from 'express';
import 'express-async-errors';
import coockieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mpozhydaiev-tickets/common';

import { newPaymentsRouter } from './routes/new';

const app = express();

app.set('trust proxy', true);
app.use(
  coockieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(express.json());
app.use(currentUser);

app.use(newPaymentsRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
