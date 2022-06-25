import express from 'express';
import 'express-async-errors';
import coockieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mpozhydaiev-tickets/common';

import { ordersListRouter } from './routes/list';
import { ordersDeleteRouter } from './routes/delete';
import { ordersItemRouter } from './routes/item';
import { ordersCreateRouter } from './routes/new';

const app = express();

app.set('trust proxy', true);
app.use(coockieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(express.json());

app.use(ordersListRouter);
app.use(ordersDeleteRouter);
app.use(ordersItemRouter);
app.use(ordersCreateRouter);

app.all('*', () => {throw new NotFoundError()});

app.use(errorHandler);

export {app};


