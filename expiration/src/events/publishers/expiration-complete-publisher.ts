import { Publisher, ExpirationCompleteEvent, Subjects } from '@hellofancypants/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

