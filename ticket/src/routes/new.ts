import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateBody } from '@mpozhydaiev-tickets/common';
import { Ticket } from '../models/Ticket';

const router = Router();

router.post('/api/tickets', 
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({gt: 0}).withMessage('Invalid Price data')
    ],
    validateBody,
    async (req: Request, res: Response) => {
        const {title, price} = req.body;
        
        const ticket = new Ticket({title, price, userId: req.currentUser!.id});
        
        await ticket.save();

        res.status(201).send(ticket);
    }
);

export {router as createTicketRouter};