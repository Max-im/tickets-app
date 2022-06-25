import { Listener, Subjects, NotFoundError, IOrderCanceled } from '@mpozhydaiev-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatePublisher } from '../publishers/ticket-update-publisher';

export class OrderCanceledListener extends Listener<IOrderCanceled> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCanceled['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new NotFoundError();

    ticket.set({ orderId: undefined });

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
