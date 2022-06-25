import { requireAuth } from '@mpozhydaiev-tickets/common';
import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';

const router = Router();

router.get('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.find({ _id: req.params.id });

  res.send(order);
});

export { router as ordersItemRouter };
