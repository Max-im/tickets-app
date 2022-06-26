import {
  Listener,
  IPaymentCreated,
  Subjects,
  NotFoundError,
  OrderStatus,
} from '@mpozhydaiev-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';

export class PaymentCreatedListener extends Listener<IPaymentCreated> {
  queueGroupName = queueGroupName;
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  async onMessage(data: IPaymentCreated['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
