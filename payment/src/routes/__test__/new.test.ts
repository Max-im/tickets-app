import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/Order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@mpozhydaiev-tickets/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

const url = '/api/payment';

it('has POST route for /api/payment', async () => {
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

it('return error if invalid userId supplied', async () => {
  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ userId: 'invalid' })
    .expect(422);

  await request(app).post(url).set('Cookie', global.signin()).send({ price: 10 }).expect(422);
});

it('return error if no token supplied', async () => {
  await request(app).post(url).set('Cookie', global.signin()).send({ title: 'title' }).expect(422);

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ userId: new mongoose.Types.ObjectId() })
    .expect(422);
});

it('return 404 if the order not found', async () => {
  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ token: 'token', orderId: new mongoose.Types.ObjectId().toString() })
    .expect(404);
});

it('return 404 if the order not found', async () => {
  const order = new Order({
    id: new mongoose.Types.ObjectId(),
    status: OrderStatus.Created,
    userId: 'some id',
    price: 50,
    version: 0,
  });

  await order.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ token: 'token', orderId: new mongoose.Types.ObjectId().toString() })
    .expect(404);
});

it('return 401 if the order try procces another person', async () => {
  const order = new Order({
    id: new mongoose.Types.ObjectId(),
    status: OrderStatus.Created,
    userId: 'some id',
    price: 50,
    version: 0,
  });

  await order.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ token: 'token', orderId: order.id.toString() })
    .expect(401);
});

it('return 400 if the order was cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toString();

  const order = new Order({
    id: new mongoose.Types.ObjectId(),
    status: OrderStatus.Canceled,
    userId,
    price: 50,
    version: 0,
  });

  await order.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin(userId))
    .send({ token: 'token', orderId: order.id.toString() })
    .expect(400);
});

it('return 201 and call stripe.charges.create if the valid data supplied', async () => {
  const userId = new mongoose.Types.ObjectId().toString();

  const order = new Order({
    id: new mongoose.Types.ObjectId(),
    status: OrderStatus.Created,
    userId,
    price: 50,
    version: 0,
  });

  await order.save();

  await request(app)
    .post(url)
    .set('Cookie', global.signin(userId))
    .send({ token: 'tok_visa', orderId: order.id.toString() })
    .expect(201);

  expect(stripe.charges.create).toHaveBeenCalled();

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');
});

it.todo('publishes event');
// , async () => {
//   const title = 'testTitle';
//   const price = 20;
//   await request(app).post(url).set('Cookie', global.signin()).send({ title, price }).expect(201);
//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
