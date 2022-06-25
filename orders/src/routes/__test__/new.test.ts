import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

const url = '/api/orders';

it('has POST route for /api/orders', async () => {
  const response = await request(app).post(url).send({});

  expect(response.status).not.toEqual(404);
});

it('accessable for authed users only', async () => {
  await request(app).post(url).send({}).expect(401);
});

it('return NOT 401 status if user signed in', async () => {
  const response = await request(app).post(url).set('Cookie', global.signin()).send({});

  expect(response.status).not.toEqual(401);
});

it('return error if invalid ticketId supplied', async () => {
  await request(app).post(url).set('Cookie', global.signin()).send({ ticketId: '' }).expect(422);

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ ticketId: 'invalidId' })
    .expect(422);
});

it('returns 404 if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app).post(url).set('Cookie', global.signin()).send({ ticketId }).expect(404);
});

it('returns 400 if ticket already reserved', async () => {
  const ticket = new Ticket({ title: 'concert', price: 20 });
  await ticket.save();
  const order = new Order({
    ticket,
    userId: 'someUser',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('create new order', async () => {
  const ticket = new Ticket({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('publishes event', async () => {
  const ticket = new Ticket({ title: 'concert', price: 20 });
  await ticket.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
