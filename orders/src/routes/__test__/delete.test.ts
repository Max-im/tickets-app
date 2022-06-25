import { OrderStatus } from '@mpozhydaiev-tickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

const url = '/api/orders';

it('change an order status to canceled', async () => {
  const ticket = new Ticket({ title: 'ticket-1', price: 20 });

  await ticket.save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post(url)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`${url}/${order.id}`).set('Cookie', user).send({}).expect(204);

  const canceledOrder = await Order.findById(order.id);

  expect(canceledOrder!.status).toEqual(OrderStatus.Canceled);
});

it('returns 401 user not authenticated', async () => {
  await request(app).delete(`${url}/orderId`).send({}).expect(401);
});

it('returns 422 if invalid order number supplied', async () => {
  const user = global.signin();

  await request(app).delete(`${url}/invalid`).set('Cookie', user).send({}).expect(422);
});

it('returns 404 if order not found', async () => {
  const user = global.signin();

  await request(app)
    .delete(`${url}/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', user)
    .send({})
    .expect(404);
});

it('returns 401 if user try to delete another user order', async () => {
  const ticket = new Ticket({ title: 'ticket-1', price: 20 });

  await ticket.save();
  const user = global.signin();
  const user2 = global.signin();

  const { body: order } = await request(app)
    .post(url)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`${url}/${order.id}`).set('Cookie', user2).send({}).expect(401);
});

it('publishes event', async () => {
  const ticket = new Ticket({ title: 'ticket-1', price: 20 });

  await ticket.save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post(url)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`${url}/${order.id}`).set('Cookie', user).send({}).expect(204);

  const canceledOrder = await Order.findById(order.id);

  expect(canceledOrder!.status).toEqual(OrderStatus.Canceled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
