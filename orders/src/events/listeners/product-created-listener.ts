import { Message } from 'node-nats-streaming';
import { Listener, ProductCreatedEvent, Subjects } from '@hellofancypants/common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const product = Product.build({
      id,
      title,
      price
    });
    await product.save();

    msg.ack();
  }
}