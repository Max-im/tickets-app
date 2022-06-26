import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { IOrderCanceled, OrderStatus } from '@mpozhydaiev-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCanceledListener } from '../order-canceled-listener';
import { Order } from '../../../models/Order';

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const order = new Order({
    id: new mongoose.Types.ObjectId(),
    version: 0,
    price: 10,
    expiresAt: 'string',
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId(),
  });

  await order.save();

  const data: IOrderCanceled['data'] = {
    id: order.id.toString(),
    version: 1,
    ticket: {
      id: 'ticketid',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('changes order status', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Canceled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
