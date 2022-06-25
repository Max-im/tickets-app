import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { IOrderCanceled, OrderStatus } from '@mpozhydaiev-tickets/common';
import { OrderCanceledListener } from '../order-canceled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const ticket = new Ticket({
    title: 'title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toString(),
    orderId: new mongoose.Types.ObjectId().toString(),
  });

  await ticket.save();

  const data: IOrderCanceled['data'] = {
    id: new mongoose.Types.ObjectId().toString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('sets userId of the ticket as undefined', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.ticket.id);

  expect(ticket!.orderId).not.toBeDefined();
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
