import { Listener, IOrderCreated, Subjects, NotFoundError } from '@mpozhydaiev-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatePublisher } from '../publishers/ticket-update-publisher';

export class OrderCreatedListener extends Listener<IOrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCreated['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new NotFoundError();

    ticket.set({ orderId: data.id });

    await ticket.save();
    await new TicketUpdatePublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      version: ticket.version,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.userId,
    });

    msg.ack();
  }
}
