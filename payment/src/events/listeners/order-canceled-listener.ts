import {
  Listener,
  Subjects,
  IOrderCanceled,
  NotFoundError,
  OrderStatus,
} from '@mpozhydaiev-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';

export class OrderCanceledListener extends Listener<IOrderCanceled> {
  subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  async onMessage(data: IOrderCanceled['data'], msg: Message) {
    const order = await Order.findOne({ _id: data.id, version: data.version - 1 });

    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    msg.ack();
  }
}
