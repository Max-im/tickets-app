import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ITicketCreated } from '@mpozhydaiev-tickets/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';
import mongoose from 'mongoose';

export class TicketCreatedListener extends Listener<ITicketCreated> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ITicketCreated['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = new Ticket({ _id: new mongoose.Types.ObjectId(id), title, price });
    await ticket.save();

    msg.ack();
  }
}
