import { Message } from 'node-nats-streaming';
import { Listener, ProductUpdatedEvent, Subjects } from '@hellofancypants/common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  readonly subject = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
    const product = await Product.findByEvent(data);

    if (!product) {
      throw new Error('Product not found');
    }

    const { title, price } = data;
    product.set({ title, price });
    await product.save();

    msg.ack();
  }
}