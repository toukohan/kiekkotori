import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError, BadRequestError } from '@hellofancypants/common';
import { Order, OrderStatus } from '../models/order';
import mongoose from 'mongoose';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
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

  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish an event saying this was cancelled!
  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    product: {
      id: order.product.id
    }
  });

  res.send(order);
});

export { router as patchOrderRouter };