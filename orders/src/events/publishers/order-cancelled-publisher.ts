import { Publisher, OrderCancelledEvent, Subjects } from '@hellofancypants/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}