import express, { Request, Response } from 'express';
import { Product } from '../models/product';

import { NotFoundError } from '@hellofancypants/common';

const router = express.Router();

router.get('/api/products', async (req: Request, res: Response) => {
  const products = await Product.find({
    orderId: undefined,
  });
  if (!products) {
    throw new NotFoundError();
  }

  res.send(products);
});

export { router as indexProductRouter };