import { Router, Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import { NotFoundError, BadRequest } from '@mpozhydaiev-tickets/common';

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    let ticket;
    try {
        ticket = await Ticket.findById(req.params.id);
    } catch(err) {
        throw new BadRequest('Error getting the ticket info');
    }
    
    if(!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export {router as showTicketRouter};