import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ITicketUpdated, NotFoundError } from '@mpozhydaiev-tickets/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<ITicketUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ITicketUpdated['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) throw new NotFoundError();

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
