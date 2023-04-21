import { Publisher, Subjects, ProductCreatedEvent } from '@hellofancypants/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
}