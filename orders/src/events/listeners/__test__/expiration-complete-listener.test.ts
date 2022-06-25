import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { IExpirationComplete, OrderStatus } from '@mpozhydaiev-tickets/common';
import { ExpirationOrderListener } from '../expiration-order-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';
import { Order } from '../../../models/Order';

const setup = async () => {
  const listener = new ExpirationOrderListener(natsWrapper.client);

  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId(),
    title: 'title',
    price: 20,
  });

  await ticket.save();

  const order = new Order({
    status: OrderStatus.Created,
    userId: 'id',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: IExpirationComplete['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('updates order status to "canceled"', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.orderId);
  expect(order!.status).toEqual(OrderStatus.Canceled);
});

it('emit OrderCanceled event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(data.orderId);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
