import express from 'express';
import 'express-async-errors';
import coockieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mpozhydaiev-tickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { listTicketRouter } from './routes/list';

const app = express();

app.set('trust proxy', true);
app.use(coockieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);
app.use(express.json());

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(listTicketRouter);

app.all('*', () => {throw new NotFoundError()});

app.use(errorHandler);

export {app};


