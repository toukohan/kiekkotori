import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';

import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';
import { createOrderRouter } from './routes/new';
import { patchOrderRouter } from './routes/patch';

import { errorHandler, NotFoundError, currentUser } from '@hellofancypants/common';


const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser);

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(patchOrderRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };