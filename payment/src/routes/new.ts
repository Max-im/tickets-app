import mongoose from 'mongoose';
import { stripe } from '../stripe';
import {
  NotFoundError,
  requireAuth,
  validateBody,
  BadRequest,
  UnauthError,
  OrderStatus,
} from '@mpozhydaiev-tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.post(
  '/api/payment',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
  ],
  validateBody,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (req!.currentUser!.id !== order.userId) throw new UnauthError();
    if (order.status === OrderStatus.Canceled) throw new BadRequest('Order was cancelled');

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    // as example to another approach to work with mongoose to make simplier work with ts
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: charge.id,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as newPaymentsRouter };
