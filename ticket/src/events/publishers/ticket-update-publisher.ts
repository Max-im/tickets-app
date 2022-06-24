import { Publisher, Subjects, ITicketUpdated } from '@mpozhydaiev-tickets/common';

export class TicketUpdatePublisher extends Publisher<ITicketUpdated> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}