import { Publisher, OrderCreatedEvent, Subjects } from '@hellofancypants/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}