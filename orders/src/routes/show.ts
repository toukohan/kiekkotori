import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { BadRequestError, requireAuth, NotFoundError, NotAuthorizedError } from '@hellofancypants/common';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new BadRequestError('Invalid order id');
  }

  const order = await Order.findById(orderId).populate('product');
  if(!order) {
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  
  res.send(order);
});

export { router as showOrderRouter };