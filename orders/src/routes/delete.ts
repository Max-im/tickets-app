import { requireAuth } from '@mpozhydaiev-tickets/common';
import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';

const router = Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const order = Order.deleteOne({ _id: req.params.id });

  res.send(order);
});

export { router as ordersDeleteRouter };
