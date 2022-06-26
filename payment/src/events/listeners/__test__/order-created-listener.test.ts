import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { IOrderCreated, OrderStatus } from '@mpozhydaiev-tickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/Order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: IOrderCreated['data'] = {
    id: new mongoose.Types.ObjectId().toString(),
    version: 0,
    expiresAt: 'string',
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toString(),
    ticket: {
      id: 'ticketid',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates order info', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
