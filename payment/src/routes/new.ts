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

    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    res.status(201).send({ success: true });
  }
);

export { router as newPaymentsRouter };