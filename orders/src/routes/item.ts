import { NotFoundError, requireAuth, UnauthError, validateBody } from '@mpozhydaiev-tickets/common';
import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/Order';

const router = Router();

router.get(
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
    const order = await Order.findOne({ _id: req.params.orderId });

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new UnauthError();

    res.send(order);
  }
);

export { router as ordersItemRouter };
