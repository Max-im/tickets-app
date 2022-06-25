import { Listener, IOrderCreated, Subjects, NotFoundError } from '@mpozhydaiev-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/Ticket';

export class OrderCreatedListener extends Listener<IOrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreated['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new NotFoundError();

    ticket.set({ orderId: data.id });

    await ticket.save();

    msg.ack();
  }
}
