import { Publisher, PaymentCreatedEvent, Subjects } from '@hellofancypants/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}