import mongoose from 'mongoose';
import { OrderStatus } from '@mpozhydaiev-tickets/common';
import { ITicket } from './Ticket';

interface IOrder {
  status: OrderStatus;
  userId: string;
  expiresAt: Date;
  ticket: ITicket;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export { Order, OrderStatus };
