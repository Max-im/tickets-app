import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ITicketCreated } from '@mpozhydaiev-tickets/common';
import { TicketCreatedListener } from '../ticker-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: ITicketCreated['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toString(),
    title: 'title',
    price: 20,
    userId: new mongoose.Types.ObjectId().toString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
