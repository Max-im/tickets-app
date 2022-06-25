import { Publisher, IOrderCanceled, Subjects } from '@mpozhydaiev-tickets/common';

export class OrderCanceledPublisher extends Publisher<IOrderCanceled> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}
