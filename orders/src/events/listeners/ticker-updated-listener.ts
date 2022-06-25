import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ITicketUpdated, NotFoundError } from '@mpozhydaiev-tickets/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';
import { ITicket } from '../../models/Ticket';

export class TicketUpdatedListener extends Listener<ITicketUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ITicketUpdated['data'], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findOne({ _id: id, version: version - 1 });

    if (!ticket) throw new NotFoundError();

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
