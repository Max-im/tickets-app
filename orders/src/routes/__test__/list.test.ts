import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

const url = '/api/orders';

it('has GET route for /api/orders', async () => {
  const response = await request(app).get(url).send({});

  expect(response.status).not.toEqual(404);
});

it('accessable for authed users only', async () => {
  await request(app).get(url).send({}).expect(401);
});

it('return NOT 401 status if user signed in', async () => {
  const response = await request(app).get(url).set('Cookie', global.signin()).send({});

  expect(response.status).not.toEqual(401);
});

it('return list of a user orders', async () => {
  const tickets = [
    new Ticket({ title: 'ticket-1', price: 20 }),
    new Ticket({ title: 'ticket-2', price: 30 }),
    new Ticket({ title: 'ticket-3', price: 40 }),
    new Ticket({ title: 'ticket-4', price: 50 }),
  ];

  for (const t of tickets) {
    await t.save();
  }

  const userOne = global.signin();
  const userTwo = global.signin();

  const o1 = await request(app).post(url).set('Cookie', userOne).send({ ticketId: tickets[0].id });
  const o2 = await request(app).post(url).set('Cookie', userTwo).send({ ticketId: tickets[1].id });
  const o3 = await request(app).post(url).set('Cookie', userTwo).send({ ticketId: tickets[2].id });

  const { body: u1orders } = await request(app).get(url).set('Cookie', userOne).send({});
  const { body: u2orders } = await request(app).get(url).set('Cookie', userTwo).send({});

  expect(u1orders.length).toEqual(1);
  expect(u1orders[0].id).toEqual(o1.body.id);
  expect(u1orders[0].ticket.id).toEqual(tickets[0].id);

  expect(u2orders.length).toEqual(2);
  expect(u2orders[0].id).toEqual(o2.body.id);
  expect(u2orders[1].id).toEqual(o3.body.id);
  expect(u2orders[0].ticket.id).toEqual(tickets[1].id);
  expect(u2orders[1].ticket.id).toEqual(tickets[2].id);
});
