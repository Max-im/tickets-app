import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { IOrderCreated, OrderStatus } from '@mpozhydaiev-tickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = new Ticket({
    title: 'title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toString(),
  });

  await ticket.save();

  const data: IOrderCreated['data'] = {
    id: new mongoose.Types.ObjectId().toString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toString(),
    expiresAt: 'string',
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('sets userId of the ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.ticket.id);

  expect(ticket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
