import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';

import { createProductRouter } from './routes/new';
import { showProductRouter } from './routes/show';
import { indexProductRouter } from './routes/index';
import { updateProductRouter } from './routes/update';

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

app.use(indexProductRouter);
app.use(createProductRouter);
app.use(showProductRouter);
app.use(updateProductRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };