import { Publisher, IOrderCreated, Subjects } from '@mpozhydaiev-tickets/common';

export class OrderCreatedPublisher extends Publisher<IOrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
