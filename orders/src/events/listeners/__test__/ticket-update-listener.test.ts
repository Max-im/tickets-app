import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ITicketUpdated } from '@mpozhydaiev-tickets/common';
import { TicketUpdatedListener } from '../ticker-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 20,
  });
  await ticket.save();

  const data: ITicketUpdated['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new-title',
    price: 30,
    userId: new mongoose.Types.ObjectId().toString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('finds updates and saves ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('throw error if ack function was not called', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
