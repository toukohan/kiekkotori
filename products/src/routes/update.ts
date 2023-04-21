import express, { Request, Response } from 'express';
import { Product } from '../models/product';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher';

import { 
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@hellofancypants/common';

const router = express.Router();

router.put('/api/products/:id', 
  requireAuth, 
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ], 
  validateRequest,
  async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError();
  }
  if(product.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  if(product.orderId) {
    throw new BadRequestError('Cannot edit a reserved product');
  }
  product.set({
    title,
    price,
  })

  await product.save();
  await new ProductUpdatedPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: product.userId,
    version: product.version
  });

  res.send(product);
});

export { router as updateProductRouter };