import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { ProductCreatedEvent } from './product-created-event';
import { Subjects } from './subjects';

class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
  queueGroupName = 'payment-service';

  onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}

export { ProductCreatedListener };