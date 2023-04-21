import { Publisher, Subjects, ProductUpdatedEvent } from '@hellofancypants/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}