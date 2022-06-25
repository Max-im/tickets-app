import mongoose from 'mongoose';
import { NotFoundError, requireAuth, validateBody, BadRequest } from '@mpozhydaiev-tickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { Ticket } from '../models/Ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-create-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPERATION_ORDER_SECONDS = 15 * 60;
const router = Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is required'),
  ],
  validateBody,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findOne({ _id: req.body.ticketId });
    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequest('Ticket already reserved');
    const experation = new Date();
    experation.setSeconds(experation.getSeconds() + EXPERATION_ORDER_SECONDS);

    const order = new Order({
      userId: req.currentUser!.id,
      expiresAt: experation,
      ticket,
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as ordersCreateRouter };
