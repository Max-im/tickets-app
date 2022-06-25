import {
  Listener,
  Subjects,
  IExpirationComplete,
  NotFoundError,
  OrderStatus,
} from '@mpozhydaiev-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';
import { OrderCanceledPublisher } from '../publishers/order-cancel-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationOrderListener extends Listener<IExpirationComplete> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: IExpirationComplete['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order!.ticket!._id.toString(),
      },
    });

    msg.ack();
  }
}
