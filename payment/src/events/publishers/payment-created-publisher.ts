import { Publisher, IPaymentCreated, Subjects } from '@mpozhydaiev-tickets/common';

export class PaymentCreatedPublisher extends Publisher<IPaymentCreated> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
