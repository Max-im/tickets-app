import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateBody,
  NotFoundError,
  BadRequest,
  UnauthError,
} from '@mpozhydaiev-tickets/common';
import { Ticket } from '../models/Ticket';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatePublisher } from '../events/publishers/ticket-update-publisher';

const router = Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Invalid Price data'),
  ],
  validateBody,
  async (req: Request, res: Response) => {
    let ticket;
    try {
      ticket = await Ticket.findById(req.params.id);
    } catch (err) {
      throw new BadRequest('Error during getting the ticket data');
    }

    if (!ticket) throw new NotFoundError();
    if (ticket.orderId) throw new BadRequest('The Ticket is locked now');
    if (ticket.userId !== req.currentUser!.id) throw new UnauthError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
