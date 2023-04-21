import { Listener, Subjects, OrderCancelledEvent, NotFoundError } from '@hellofancypants/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const product = await Product.findById(data.product.id);

    if (!product) {
      throw new NotFoundError();
    }

    product.set({ orderId: undefined });
    await product.save();
    
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      userId: product.userId,
      version: product.version,
      orderId: product.orderId,
    });

    msg.ack();
  }
}