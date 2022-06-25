import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnauthError,
  validateBody,
} from '@mpozhydaiev-tickets/common';
import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/Order';

const router = Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Invalid Order Id'),
  ],
  validateBody,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new UnauthError();

    order.status = OrderStatus.Canceled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as ordersDeleteRouter };
