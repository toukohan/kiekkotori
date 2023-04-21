import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from '@hellofancypants/common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const product = await Product.findById(data.product.id);

    if (!product) {
      throw new NotFoundError();
    }

    product.set({ orderId: data.id });
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