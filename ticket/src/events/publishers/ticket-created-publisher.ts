import { Publisher, Subjects, ITicketCreated } from '@mpozhydaiev-tickets/common';

export class TicketCreatedPublisher extends Publisher<ITicketCreated> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}