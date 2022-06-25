import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

const url = '/api/orders';

it('returns an order data', async () => {
  const ticket = new Ticket({ title: 'ticket-1', price: 20 });

  await ticket.save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post(url)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).get(`${url}/${order.id}`).set('Cookie', user).send({}).expect(200);
});

it('returns 401 user not authenticated', async () => {
  await request(app).get(`${url}/orderId`).send({}).expect(401);
});

it('returns 422 if invalid order number supplied', async () => {
  const user = global.signin();

  await request(app).get(`${url}/invalid`).set('Cookie', user).send({}).expect(422);
});

it('returns 404 if order not found', async () => {
  const user = global.signin();

  await request(app)
    .get(`${url}/${new mongoose.Types.ObjectId()}`)
    .set('Cookie', user)
    .send({})
    .expect(404);
});

it('returns 401 if user try to get access to another user order', async () => {
  const ticket = new Ticket({ title: 'ticket-1', price: 20 });

  await ticket.save();
  const user = global.signin();
  const user2 = global.signin();

  const { body: order } = await request(app)
    .post(url)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).get(`${url}/${order.id}`).set('Cookie', user2).send({}).expect(401);
});
