import { Subjects, Publisher, IExpirationComplete } from '@mpozhydaiev-tickets/common';

export class ExpirationCompletePublisher extends Publisher<IExpirationComplete> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
